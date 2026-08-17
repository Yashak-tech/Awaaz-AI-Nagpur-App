import React, { useState } from 'react';
import { Search, ArrowUp, MessageCircle, Flag, X, Mic, Building2, Clock, MapPin, CheckCircle, Star, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { motion, AnimatePresence } from 'motion/react';
import { Report, Comment, User } from '../App';
import { translations } from './translations';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MediaCarousel } from './MediaCarousel';
import { FloatingActionButton } from './FloatingActionButton';
import { getSeverityColor } from '../utils/severityColors';
import { RatingPrompt } from './RatingPrompt';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AudioPlayer } from './AudioPlayer';

interface HomeScreenProps {
  reports: Report[];
  user: User;
  onReportSelect: (report: Report) => void;
  onUpvote: (reportId: string) => void;
  onAddComment: (reportId: string, comment: string) => void;
  selectedReport: Report | null;
  onCloseModal: () => void;
  onReportAgain: () => void;
  isAdminView?: boolean;
  onStatusUpdate?: (reportId: string, status: Report['status']) => void;
  onRateReport?: (reportId: string, rating: number) => void;
}

export function HomeScreen({
  reports,
  user,
  onReportSelect,
  onUpvote,
  onAddComment,
  selectedReport,
  onCloseModal,
  onReportAgain,
  isAdminView,
  onStatusUpdate,
  onRateReport
}: HomeScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showUpvotePopup, setShowUpvotePopup] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [upvotedReportId, setUpvotedReportId] = useState<string | null>(null);
  const [commentedReportId, setCommentedReportId] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState('');
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [ratingReportId, setRatingReportId] = useState<string | null>(null);

  const t = translations[user.language];

  const getDepartmentInfo = (issueType: string) => {
    const departments: Record<string, { name: string; fullName: string; color: string }> = {
      'road': { name: 'PWD', fullName: 'Public Works Department', color: 'bg-blue-100 text-blue-800' },
      'garbage': { name: 'WMD', fullName: 'Waste Management Department', color: 'bg-green-100 text-green-800' },
      'streetlight': { name: 'ED', fullName: 'Electrical Department', color: 'bg-yellow-100 text-yellow-800' },
      'water': { name: 'WSD', fullName: 'Water Supply Department', color: 'bg-cyan-100 text-cyan-800' },
      'drainage': { name: 'DD', fullName: 'Drainage Department', color: 'bg-purple-100 text-purple-800' },
      'other': { name: 'MC', fullName: 'Municipal Corporation', color: 'bg-gray-100 text-gray-800' }
    };
    return departments[issueType.toLowerCase()] || departments.other;
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} ${t.minutesAgo}`;
    } else if (diffHours < 24) {
      return `${diffHours} ${t.hoursAgo}`;
    } else {
      return `${diffDays} ${t.daysAgo}`;
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'pending': return t.statusPending;
      case 'acknowledged': return 'Acknowledged';
      case 'submitted': return t.statusInProgress;
      case 'resolved': return t.statusResolved;
      default: return status;
    }
  };

  const filteredReports = reports
    .filter(report => 
      report.district === user.district &&
      (searchTerm === '' || 
       report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       report.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
       report.street.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      // Sort by distance then by recency
      if (a.distance !== b.distance) {
        return a.distance - b.distance;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  const handleUpvoteClick = (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation();
    onUpvote(reportId);
    
    // Show upvote confirmation popup
    setUpvotedReportId(reportId);
    setShowUpvotePopup(true);
    
    // Auto-hide popup after 2 seconds
    setTimeout(() => {
      setShowUpvotePopup(false);
      setUpvotedReportId(null);
    }, 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && selectedReport) {
      onAddComment(selectedReport.id, newComment.trim());
      setTempComment(newComment.trim());
      setNewComment('');
      
      // Show comment confirmation popup
      setCommentedReportId(selectedReport.id);
      setShowCommentPopup(true);
      
      // Auto-hide popup after 2 seconds
      setTimeout(() => {
        setShowCommentPopup(false);
        setCommentedReportId(null);
        setTempComment('');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Awaaz-AI Logo" className="w-10 h-10 object-contain rounded-full border border-gray-100 shadow-sm" />
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">Awaaz-AI</h1>
                <p className="text-xs font-semibold text-emerald-600">The Nagpur App • NMC</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-green-600">{filteredReports.length} Active Reports</div>
              <div className="text-xs text-muted-foreground">Real-time updates</div>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
          <p className='mt-2 text-sm text-red-500'>All the data shown here is hardcoded for the prototype</p>
        </div>
      </div>

      {/* Reports Feed */}
      <div className="p-3 space-y-4 bg-gray-50">
        {filteredReports.map((report) => (
          <motion.div
            key={report.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 flex flex-col"
            onClick={() => onReportSelect(report)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Location full width at top */}
            <div className="pl-4 pr-4 pt-4 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold text-gray-900 text-sm">{report.ward}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="truncate">{report.street}</span>
                <span className="text-gray-400">•</span>
                <span className="whitespace-nowrap">{report.distance}km away</span>
                <div className="flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-[11px] text-gray-500 whitespace-nowrap">{formatTimeAgo(report.timestamp)}</span>
                </div>
              </div>
            </div>

            {/* Report title and description */}
            <div className="mt-2.5 px-4 pb-2">
              <h4 className="font-bold text-gray-900 text-base mb-1 leading-snug">{report.title}</h4>
              <p className="text-xs text-gray-700 leading-relaxed line-clamp-2 mb-2">{report.description}</p>
              
              {report.sourceLabel && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-2 bg-slate-100 text-slate-700 text-[11px] rounded-md border border-slate-200 font-medium">
                  <span>📰</span>
                  <span className="truncate max-w-[280px]">{report.sourceLabel}</span>
                </div>
              )}

              {report.audioUrl && (
                <div className="mt-1 mb-1">
                  <AudioPlayer
                    audioUrl={report.audioUrl}
                    durationSeconds={report.voiceDurationSeconds}
                    compact={true}
                  />
                </div>
              )}
            </div>
            
            {/* Media Container */}
            <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
              <MediaCarousel
                media={report.media || [{
                  id: `${report.id}-main`,
                  type: 'image',
                  url: report.imageUrl
                }]}
                className="w-full h-full object-cover"
              />
              {report.isDuplicateMerged && (
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] px-2.5 py-1 rounded-full font-bold shadow-md">
                  🔄 {report.duplicateCount || 3} Duplicate Complaints Merged
                </div>
              )}
              {report.isProactiveSensorAlert && (
                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] px-2.5 py-1 rounded-full font-bold shadow-md flex items-center gap-1">
                  ⚡ Proactive AI Pre-Complaint Alert
                </div>
              )}
              {report.isTamperDetected && (
                <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  ⚠️ Verified
                </div>
              )}
            </div>

            {/* Actions & Badges */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <motion.button
                    className={`flex items-center gap-1 text-xs font-semibold transition-all duration-200 px-2.5 py-1.5 rounded-lg border ${
                      report.hasUserUpvoted 
                        ? 'text-green-700 bg-green-50 border-green-300' 
                        : 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={(e: React.MouseEvent) => handleUpvoteClick(e, report.id)}
                    whileTap={{ scale: 1.1 }}
                  >
                    <ArrowUp className={`w-4 h-4 ${report.hasUserUpvoted ? 'fill-current text-green-600' : ''}`} />
                    <span>{report.upvotes}</span>
                  </motion.button>
                  
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-100">
                    <MessageCircle className="w-4 h-4" />
                    <span>{report.comments.length}</span>
                  </button>

                  {/* Severity indicator */}
                  {report.severity && (
                    <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${getSeverityColor(report.severity).bg} ${getSeverityColor(report.severity).text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getSeverityColor(report.severity).dot}`}></span>
                      {getSeverityColor(report.severity).label} ({report.severity}/10)
                    </div>
                  )}
                </div>
                
                {/* Status badge */}
                <Badge className={`text-xs px-2.5 py-1 font-semibold ${getStatusColor(report.status)}`}>
                  {getStatusText(report.status)}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredReports.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No reports found for your search.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onReportClick={onReportAgain}
        onQuickPhotoClick={onReportAgain}
        isVisible={true}
      />

      {/* Upvote Confirmation Popup */}
      <AnimatePresence>
        {showUpvotePopup && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-20 right-4 z-[9999] bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 max-w-xs"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Upvoted successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Confirmation Popup */}
      <AnimatePresence>
        {showCommentPopup && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-36 right-4 z-[9999] bg-blue-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 max-w-xs"
          >
            <MessageCircle className="w-5 h-5" />
            <div className="flex flex-col">
              <span className="font-medium">Comment added!</span>
              <span className="text-sm opacity-90 truncate">{tempComment}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Report Detail Modal (without backdrop) */}
      {selectedReport && (
        <motion.div
          className="fixed inset-0 max-w-sm mx-auto bg-white z-[10000] overflow-y-auto"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">{selectedReport.title}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {selectedReport.ward} • {selectedReport.street} • {formatTimeAgo(selectedReport.timestamp)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 p-1 h-8 w-8"
              onClick={onCloseModal}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            {/* Image */}
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <ImageWithFallback
                src={selectedReport.imageUrl}
                alt={selectedReport.title}
                className="w-full h-full object-cover"
              />
              {selectedReport.isTamperDetected && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  {t.tamperDetected}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge className={`text-xs ${getStatusColor(selectedReport.status)}`}>
                  {getStatusText(selectedReport.status)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(selectedReport.timestamp)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                {selectedReport.ward} • {selectedReport.street} • {typeof selectedReport.distance === 'number' ? `${selectedReport.distance.toFixed(1)} km` : '0.3 km'}
              </p>

              <Badge variant="secondary" className="text-xs mb-3">
                {selectedReport.aiTag} — {selectedReport.aiConfidence}% {t.confidence}
              </Badge>

              {/* Department Routing Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Department Assignment</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-blue-800">
                    <strong>{getDepartmentInfo(selectedReport.type).name}</strong> - {getDepartmentInfo(selectedReport.type).fullName}
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span className="text-xs text-blue-700">
                      Estimated response: 24-48 hours
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm mb-4 font-medium text-slate-800 leading-relaxed">{selectedReport.description}</p>

              {/* Real Interactive Voice Note Player */}
              {selectedReport.audioUrl ? (
                <div className="mb-4">
                  <AudioPlayer
                    audioUrl={selectedReport.audioUrl}
                    durationSeconds={selectedReport.voiceDurationSeconds}
                  />
                </div>
              ) : null}

              {/* Verified Real News & Photo Source Citation */}
              {selectedReport.sourceUrl && (
                <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span>📰</span>
                    <span>Real-World Grounded Evidence Source:</span>
                  </div>
                  <p className="text-slate-600 mb-2 font-medium">{selectedReport.sourceLabel || 'Nagpur Civic News Report'}</p>
                  <a
                    href={selectedReport.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-2"
                  >
                    <span>View original source reference & photos</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                className={`flex items-center gap-1 px-3 py-2 rounded text-sm ${
                  selectedReport.hasUserUpvoted
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
                onClick={() => onUpvote(selectedReport.id)}
                whileTap={{ scale: 1.05 }}
              >
                <ArrowUp className="w-4 h-4" />
                {selectedReport.upvotes} {t.upvote}
              </motion.button>

              <Button variant="outline" size="sm">
                <Flag className="w-4 h-4 mr-1" />
                Flag
              </Button>
            </div>

            {/* Admin Status Update Controls */}
            {isAdminView && onStatusUpdate && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <label className="text-sm font-medium text-amber-900 block mb-2">
                  🔧 Admin: Update Status
                </label>
                <Select
                  value={selectedReport.status}
                  onValueChange={(value: string) => onStatusUpdate(selectedReport.id, value as Report['status'])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="repair_scheduled">Repair Scheduled</SelectItem>
                    <SelectItem value="under_process">Under Process</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Satisfaction Rating Display & Prompt */}
            {selectedReport.status === 'resolved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">Resolution Rating</span>
                  {selectedReport.satisfactionRating ? (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= selectedReport.satisfactionRating!
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-green-700 ml-1">
                        {selectedReport.satisfactionRating}/5
                      </span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setRatingReportId(selectedReport.id);
                        setShowRatingPrompt(true);
                      }}
                    >
                      ⭐ Rate Resolution
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Comments */}
            <div>
              <h4 className="font-medium mb-3">{t.comments}</h4>
              
              <div className="space-y-3 mb-4">
                {selectedReport.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>

              {/* Add comment */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Textarea
                  placeholder={t.addComment}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 min-h-0 h-10"
                />
                <Button type="submit" size="sm" disabled={!newComment.trim()}>
                  {t.postComment}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      )}

      {/* Rating Prompt Modal */}
      {ratingReportId && (
        <RatingPrompt
          isOpen={showRatingPrompt}
          onClose={() => {
            setShowRatingPrompt(false);
            setRatingReportId(null);
          }}
          onRate={(rating) => {
            if (onRateReport && ratingReportId) {
              onRateReport(ratingReportId, rating);
            }
          }}
          reportTitle={reports.find(r => r.id === ratingReportId)?.title || ''}
        />
      )}
    </div>
  );
}