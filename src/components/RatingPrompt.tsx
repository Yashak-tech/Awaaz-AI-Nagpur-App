// Citizen Satisfaction Rating Prompt for Awaaz-AI
// Appears when a resolved report needs citizen feedback (1-5 stars)

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';

interface RatingPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onRate: (rating: number) => void;
  reportTitle: string;
}

export function RatingPrompt({ isOpen, onClose, onRate, reportTitle }: RatingPromptProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const handleSubmit = () => {
    if (selectedRating > 0) {
      onRate(selectedRating);
      setSelectedRating(0);
      onClose();
    }
  };

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Rate this Resolution</DialogTitle>
          <DialogDescription className="text-sm">
            How satisfied are you with the resolution of: <strong>{reportTitle}</strong>?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="p-1 transition-transform hover:scale-110"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setSelectedRating(star)}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoveredStar || selectedRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {(hoveredStar > 0 || selectedRating > 0) && (
            <span className="text-sm font-medium text-gray-600">
              {ratingLabels[hoveredStar || selectedRating]}
            </span>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Skip
          </Button>
          <Button onClick={handleSubmit} disabled={selectedRating === 0}>
            Submit Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
