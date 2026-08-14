export type Language = 'english' | 'hindi' | 'marathi' | 'bengali' | 'santhali' | 'nagpuri';

export const translations = {
  english: {
    // Core UI strings
    report: "Report",
    submit: "Submit",
    savedOffline: "Saved locally — will sync when online",
    demoLabel: "Awaaz-AI Demo — Nagpur Municipal Corporation",
    upvote: "Upvote",
    comment: "Comment",
    map: "Map", 
    profile: "Profile",
    reportAgain: "Report Again",
    statusPending: "Status: Pending",
    statusInProgress: "Status: Submitted", 
    statusResolved: "Status: Resolved",
    
    // Additional strings
    home: "Home",
    requestLocation: "Request Location Permission",
    useThisLocation: "Use this location",
    selectDistrict: "Select District",
    allowLocation: "Allow location access to detect your municipal area automatically",
    detectingLocation: "Detecting your location...",
    locationDetected: "Location detected:",
    manualSelection: "Or select manually:",
    selectLanguage: "Select Language",
    continue: "Continue",
    
    // Report screen
    capturePhoto: "Capture Photo",
    issueType: "Issue Type",
    severity: "Severity",
    description: "Description",
    optional: "Optional",
    recordVoiceNote: "Record Voice Note",
    location: "Location",
    cancel: "Cancel",
    
    // Feed
    localFeed: "Local Social Feed",
    search: "Search by keyword or ward...",
    minutesAgo: "minutes ago",
    hoursAgo: "hours ago",
    daysAgo: "days ago",
    confidence: "confidence",
    comments: "comments",
    viewDetails: "View Details",
    addComment: "Add comment...",
    postComment: "Post",
    
    // Map
    allReports: "All",
    road: "Road",
    garbage: "Garbage", 
    water: "Water",
    streetlight: "Streetlight",
    unresolved: "Unresolved",
    
    // Profile
    myReports: "My Reports",
    settings: "Settings",
    language: "Language",
    onlineMode: "Online Mode",
    offlineMode: "Offline Mode",
    slaCountdown: "SLA: 5 days remaining",
    rateResolution: "Rate this resolution",
    
    // Status and notifications
    reportSubmitted: "Report submitted successfully! ID:",
    syncComplete: "Sync complete - report uploaded",
    tamperDetected: "⚠️ Tamper detected",
    highPriority: "🔴 High Priority",
    
    // Issue types
    pothole: "Pothole",
    brokenRoad: "Broken Road",
    garbagePile: "Garbage Pile",
    drainageIssue: "Drainage Issue",
    waterLogging: "Water Logging",
    brokenStreetlight: "Broken Streetlight",
    other: "Other"
  },
  
  hindi: {
    // Core UI strings
    report: "रिपोर्ट करें",
    submit: "सबमिट करें", 
    savedOffline: "स्थानीय रूप से सहेजा गया — ऑनलाइन होने पर सिंक करेगा",
    demoLabel: "आवाज़-AI डेमो — नागपूर महानगरपालिका",
    upvote: "अपवोट",
    comment: "टिप्पणी", 
    map: "मानचित्र",
    profile: "प्रोफ़ाइल",
    reportAgain: "फिर से रिपोर्ट करें",
    statusPending: "स्थिति: लंबित",
    statusInProgress: "स्थिति: प्रगति पर",
    statusResolved: "स्थिति: हल हुआ",
    
    // Additional strings
    home: "होम",
    requestLocation: "स्थान अनुमति का अनुरोध करें",
    useThisLocation: "इस स्थान का उपयोग करें",
    selectDistrict: "जिला चुनें",
    allowLocation: "अपने जिले का स्वचालित पता लगाने के लिए स्थान पहुंच की अनुमति दें",
    detectingLocation: "आपका स्थान खोजा जा रहा है...",
    locationDetected: "स्थान का पता चला:",
    manualSelection: "या मैन्युअल रूप से चुनें:",
    selectLanguage: "भाषा चुनें",
    continue: "जारी रखें",
    
    // Report screen
    capturePhoto: "फोटो लें",
    issueType: "समस्या का प्रकार",
    severity: "गंभीरता",
    description: "विवरण",
    optional: "वैकल्पिक",
    recordVoiceNote: "आवाज का नोट रिकॉर्ड करें",
    location: "स्थान",
    cancel: "रद्द करें",
    
    // Feed
    localFeed: "स्थानीय सामाजिक फीड",
    search: "कीवर्ड या वार्ड द्वारा खोजें...",
    minutesAgo: "मिनट पहले",
    hoursAgo: "घंटे पहले", 
    daysAgo: "दिन पहले",
    confidence: "विश्वास",
    comments: "टिप्पणियां",
    viewDetails: "विवरण देखें",
    addComment: "टिप्पणी जोड़ें...",
    postComment: "पोस्ट करें",
    
    // Map
    allReports: "सभी",
    road: "सड़क",
    garbage: "कचरा",
    water: "पानी", 
    streetlight: "स्ट्रीट लाइट",
    unresolved: "अनसुलझा",
    
    // Profile
    myReports: "मेरी रिपोर्ट्स",
    settings: "सेटिंग्स",
    language: "भाषा",
    onlineMode: "ऑनलाइन मोड",
    offlineMode: "ऑफलाइन मोड",
    slaCountdown: "SLA: 5 दिन बचे हैं",
    rateResolution: "इस समाधान को रेट करें",
    
    // Status and notifications
    reportSubmitted: "रिपोर्ट सफलतापूर्वक सबमिट की गई! ID:",
    syncComplete: "सिंक पूर्ण - रिपोर्ट अपलोड की गई",
    tamperDetected: "⚠️ छेड़छाड़ का पता चला",
    highPriority: "🔴 उच्च प्राथमिकता",
    
    // Issue types
    pothole: "गड्ढा",
    brokenRoad: "टूटी सड़क",
    garbagePile: "कचरे का ढेर",
    drainageIssue: "नाली की समस्या",
    waterLogging: "जल भराव",
    brokenStreetlight: "टूटी स्ट्रीट लाइट",
    other: "अन्य"
  },
  
  bengali: {
    // Core UI strings
    report: "রিপোর্ট করুন",
    submit: "জমা দিন",
    savedOffline: "স্থানীয়ভাবে সংরক্ষণ করা হয়েছে — অনলাইনে ফিরে এলে সিঙ্ক হবে",
    demoLabel: "আওয়াজ-AI ডেমো — নাগপুর পৌরসংস্থা",
    upvote: "আপভোট",
    comment: "মন্তব্য",
    map: "মানচিত্র", 
    profile: "প্রোফাইল",
    reportAgain: "আবার রিপোর্ট করুন",
    statusPending: "স্থিতি: মুলতুবি",
    statusInProgress: "স্থিতি: প্রক্রিয়াধীন",
    statusResolved: "স্থিতি: সমাধান হয়েছে",
    
    // Additional strings  
    home: "হোম",
    requestLocation: "অবস্থানের অনুমতির অনুরোধ করুন",
    useThisLocation: "এই অবস্থান ব্যবহার করুন",
    selectDistrict: "জেলা নির্বাচন করুন",
    allowLocation: "আপনার জেলা স্বয়ংক্রিয়ভাবে সনাক্ত করতে অবস্থান অ্যাক্সেসের অনুমতি দিন",
    detectingLocation: "আপনার অবস্থান সনাক্ত করা হচ্ছে...",
    locationDetected: "অবস্থান সনাক্ত করা হয়েছে:",
    manualSelection: "অথবা ম্যানুয়ালি নির্বাচন করুন:",
    selectLanguage: "ভাষা নির্বাচন করুন",
    continue: "অব্যাহত রাখুন",
    
    // Report screen
    capturePhoto: "ছবি তুলুন",
    issueType: "সমস্যার ধরন",
    severity: "গুরুত্ব",
    description: "বিবরণ",
    optional: "ঐচ্ছিক",
    recordVoiceNote: "ভয়েস নোট রেকর্ড করুন",
    location: "অবস্থান",
    cancel: "বাতিল করুন",
    
    // Feed
    localFeed: "স্থানীয় সামাজিক ফিড",
    search: "কীওয়ার্ড বা ওয়ার্ড দিয়ে খুঁজুন...",
    minutesAgo: "মিনিট আগে",
    hoursAgo: "ঘণ্টা আগে",
    daysAgo: "দিন আগে", 
    confidence: "আস্থা",
    comments: "মন্তব্য",
    viewDetails: "বিস্তারিত দেখুন",
    addComment: "মন্তব্য যোগ করুন...",
    postComment: "পোস্ট করুন",
    
    // Map
    allReports: "সকল",
    road: "রাস্তা",
    garbage: "আবর্জনা",
    water: "পানি",
    streetlight: "স্ট্রিট লাইট", 
    unresolved: "অমীমাংসিত",
    
    // Profile
    myReports: "আমার রিপোর্ট",
    settings: "সেটিংস",
    language: "ভাষা",
    onlineMode: "অনলাইন মোড",
    offlineMode: "অফলাইন মোড",
    slaCountdown: "SLA: ৫ দিন বাকি",
    rateResolution: "এই সমাধানটি রেট করুন",
    
    // Status and notifications
    reportSubmitted: "রিপোর্ট সফলভাবে জমা দেওয়া হয়েছে! ID:",
    syncComplete: "সিঙ্ক সম্পন্ন - রিপোর্ট আপলোড হয়েছে",
    tamperDetected: "⚠️ ছেড়া ধরা পড়েছে",
    highPriority: "🔴 উচ্চ অগ্রাধিকার",
    
    // Issue types
    pothole: "গর্ত",
    brokenRoad: "ভাঙা রাস্তা",
    garbagePile: "আবর্জনার স্তূপ",
    drainageIssue: "নিকাশি সমস্যা",
    waterLogging: "জল জমে থাকা",
    brokenStreetlight: "ভাঙা স্ট্রিট লাইট",
    other: "অন্যান্য"
  },
  
  santhali: {
    // Core UI strings with transliterated placeholders
    report: "Santhali: [Report placeholder]",
    submit: "Santhali: [Submit placeholder]", 
    savedOffline: "Santhali: [Saved locally placeholder]",
    demoLabel: "Santhali: [Demo label placeholder]",
    upvote: "Santhali: [Upvote placeholder]",
    comment: "Santhali: [Comment placeholder]",
    map: "Santhali: [Map placeholder]",
    profile: "Santhali: [Profile placeholder]", 
    reportAgain: "Santhali: [Report Again placeholder]",
    statusPending: "Santhali: [Status Pending placeholder]",
    statusInProgress: "Santhali: [Status Submitted placeholder]",
    statusResolved: "Santhali: [Status Resolved placeholder]",
    
    // Additional strings
    home: "Santhali: [Home placeholder]",
    requestLocation: "Santhali: [Request Location placeholder]",
    useThisLocation: "Santhali: [Use Location placeholder]",
    selectDistrict: "Santhali: [Select District placeholder]",
    allowLocation: "Santhali: [Allow Location placeholder]",
    detectingLocation: "Santhali: [Detecting placeholder]",
    locationDetected: "Santhali: [Location detected placeholder]",
    manualSelection: "Santhali: [Manual selection placeholder]",
    selectLanguage: "Santhali: [Select Language placeholder]",
    continue: "Santhali: [Continue placeholder]",
    
    // Report screen
    capturePhoto: "Santhali: [Capture Photo placeholder]",
    issueType: "Santhali: [Issue Type placeholder]",
    severity: "Santhali: [Severity placeholder]",
    description: "Santhali: [Description placeholder]",
    optional: "Santhali: [Optional placeholder]",
    recordVoiceNote: "Santhali: [Voice Note placeholder]",
    location: "Santhali: [Location placeholder]",
    cancel: "Santhali: [Cancel placeholder]",
    
    // Feed
    localFeed: "Santhali: [Local Feed placeholder]",
    search: "Santhali: [Search placeholder]",
    minutesAgo: "Santhali: [Minutes ago placeholder]",
    hoursAgo: "Santhali: [Hours ago placeholder]",
    daysAgo: "Santhali: [Days ago placeholder]",
    confidence: "Santhali: [Confidence placeholder]",
    comments: "Santhali: [Comments placeholder]",
    viewDetails: "Santhali: [View Details placeholder]",
    addComment: "Santhali: [Add Comment placeholder]",
    postComment: "Santhali: [Post placeholder]",
    
    // Map
    allReports: "Santhali: [All placeholder]",
    road: "Santhali: [Road placeholder]",
    garbage: "Santhali: [Garbage placeholder]",
    water: "Santhali: [Water placeholder]",
    streetlight: "Santhali: [Streetlight placeholder]",
    unresolved: "Santhali: [Unresolved placeholder]",
    
    // Profile
    myReports: "Santhali: [My Reports placeholder]",
    settings: "Santhali: [Settings placeholder]",
    language: "Santhali: [Language placeholder]",
    onlineMode: "Santhali: [Online Mode placeholder]",
    offlineMode: "Santhali: [Offline Mode placeholder]",
    slaCountdown: "Santhali: [SLA placeholder]",
    rateResolution: "Santhali: [Rate Resolution placeholder]",
    
    // Status and notifications
    reportSubmitted: "Santhali: [Report Submitted placeholder]",
    syncComplete: "Santhali: [Sync Complete placeholder]",
    tamperDetected: "Santhali: [Tamper Detected placeholder]",
    highPriority: "Santhali: [High Priority placeholder]",
    
    // Issue types
    pothole: "Santhali: [Pothole placeholder]",
    brokenRoad: "Santhali: [Broken Road placeholder]",
    garbagePile: "Santhali: [Garbage Pile placeholder]",
    drainageIssue: "Santhali: [Drainage placeholder]",
    waterLogging: "Santhali: [Water Logging placeholder]",
    brokenStreetlight: "Santhali: [Broken Streetlight placeholder]",
    other: "Santhali: [Other placeholder]"
  },
  
  nagpuri: {
    // Core UI strings with transliterated placeholders
    report: "Nagpuri: [Report placeholder]",
    submit: "Nagpuri: [Submit placeholder]",
    savedOffline: "Nagpuri: [Saved locally placeholder]",
    demoLabel: "Nagpuri: [Demo label placeholder]",
    upvote: "Nagpuri: [Upvote placeholder]",
    comment: "Nagpuri: [Comment placeholder]",
    map: "Nagpuri: [Map placeholder]",
    profile: "Nagpuri: [Profile placeholder]",
    reportAgain: "Nagpuri: [Report Again placeholder]",
    statusPending: "Nagpuri: [Status Pending placeholder]",
    statusInProgress: "Nagpuri: [Status Submitted placeholder]",
    statusResolved: "Nagpuri: [Status Resolved placeholder]",
    
    // Additional strings
    home: "Nagpuri: [Home placeholder]",
    requestLocation: "Nagpuri: [Request Location placeholder]",
    useThisLocation: "Nagpuri: [Use Location placeholder]",
    selectDistrict: "Nagpuri: [Select District placeholder]",
    allowLocation: "Nagpuri: [Allow Location placeholder]",
    detectingLocation: "Nagpuri: [Detecting placeholder]",
    locationDetected: "Nagpuri: [Location detected placeholder]",
    manualSelection: "Nagpuri: [Manual selection placeholder]",
    selectLanguage: "Nagpuri: [Select Language placeholder]",
    continue: "Nagpuri: [Continue placeholder]",
    
    // Report screen
    capturePhoto: "Nagpuri: [Capture Photo placeholder]",
    issueType: "Nagpuri: [Issue Type placeholder]",
    severity: "Nagpuri: [Severity placeholder]",
    description: "Nagpuri: [Description placeholder]",
    optional: "Nagpuri: [Optional placeholder]",
    recordVoiceNote: "Nagpuri: [Voice Note placeholder]",
    location: "Nagpuri: [Location placeholder]",
    cancel: "Nagpuri: [Cancel placeholder]",
    
    // Feed
    localFeed: "Nagpuri: [Local Feed placeholder]",
    search: "Nagpuri: [Search placeholder]",
    minutesAgo: "Nagpuri: [Minutes ago placeholder]",
    hoursAgo: "Nagpuri: [Hours ago placeholder]",
    daysAgo: "Nagpuri: [Days ago placeholder]",
    confidence: "Nagpuri: [Confidence placeholder]",
    comments: "Nagpuri: [Comments placeholder]",
    viewDetails: "Nagpuri: [View Details placeholder]",
    addComment: "Nagpuri: [Add Comment placeholder]",
    postComment: "Nagpuri: [Post placeholder]",
    
    // Map
    allReports: "Nagpuri: [All placeholder]",
    road: "Nagpuri: [Road placeholder]",
    garbage: "Nagpuri: [Garbage placeholder]",
    water: "Nagpuri: [Water placeholder]",
    streetlight: "Nagpuri: [Streetlight placeholder]",
    unresolved: "Nagpuri: [Unresolved placeholder]",
    
    // Profile
    myReports: "Nagpuri: [My Reports placeholder]",
    settings: "Nagpuri: [Settings placeholder]",
    language: "Nagpuri: [Language placeholder]",
    onlineMode: "Nagpuri: [Online Mode placeholder]",
    offlineMode: "Nagpuri: [Offline Mode placeholder]",
    slaCountdown: "Nagpuri: [SLA placeholder]",
    rateResolution: "Nagpuri: [Rate Resolution placeholder]",
    
    // Status and notifications
    reportSubmitted: "Nagpuri: [Report Submitted placeholder]",
    syncComplete: "Nagpuri: [Sync Complete placeholder]",
    tamperDetected: "Nagpuri: [Tamper Detected placeholder]",
    highPriority: "Nagpuri: [High Priority placeholder]",
    
    // Issue types
    pothole: "Nagpuri: [Pothole placeholder]",
    brokenRoad: "Nagpuri: [Broken Road placeholder]",
    garbagePile: "Nagpuri: [Garbage Pile placeholder]",
    drainageIssue: "Nagpuri: [Drainage placeholder]",
    waterLogging: "Nagpuri: [Water Logging placeholder]",
    brokenStreetlight: "Nagpuri: [Broken Streetlight placeholder]",
    other: "Nagpuri: [Other placeholder]"
  },

  marathi: {
    // Core UI strings
    report: "तक्रार नोंदवा",
    submit: "सबमिट करा",
    savedOffline: "स्थानिकरित्या जतन केले — ऑनलाइन झाल्यावर सिंक होईल",
    demoLabel: "आवाज़-AI डेमो — नागपूर महानगरपालिका",
    upvote: "अपव्होट",
    comment: "प्रतिक्रिया",
    map: "नकाशा", 
    profile: "प्रोफाईल",
    reportAgain: "पुन्हा तक्रार नोंदवा",
    statusPending: "स्थिती: प्रलंबित",
    statusInProgress: "स्थिती: सबमिट केले", 
    statusResolved: "स्थिती: निवारण झाले",
    
    // Additional strings
    home: "मुख्यपृष्ठ",
    requestLocation: "स्थान परवानगी द्या",
    useThisLocation: "हे स्थान वापरा",
    selectDistrict: "जिल्हा निवडा",
    allowLocation: "तुमचा मनपा विभाग आपोआप ओळखण्यासाठी स्थान प्रवेशाची अनुमती द्या",
    detectingLocation: "तुमचे स्थान शोधत आहे...",
    locationDetected: "स्थान सापडले:",
    manualSelection: "किंवा मॅन्युअली निवडा:",
    selectLanguage: "भाषा निवडा",
    continue: "पुढे जा",
    
    // Report screen
    capturePhoto: "फोटो काढा",
    issueType: "समस्येचा प्रकार",
    severity: "गंभीरता",
    description: "वर्णन",
    optional: "ऐच्छिक",
    recordVoiceNote: "व्हॉईस टीप रेकॉर्ड करा",
    location: "स्थान",
    cancel: "रद्द करा",
    
    // Feed
    localFeed: "स्थानिक नागपूर फीड",
    search: "कीवर्ड किंवा प्रभाग/झोननुसार शोधा...",
    minutesAgo: "मिनिटांपूर्वी",
    hoursAgo: "तासांपूर्वी",
    daysAgo: "दिवसांपूर्वी",
    confidence: "विश्वासार्हता",
    comments: "प्रतिक्रिया",
    viewDetails: "तपशील पहा",
    addComment: "प्रतिक्रिया जोडा...",
    postComment: "पोस्ट करा",
    
    // Map
    allReports: "सर्व",
    road: "रस्ता",
    garbage: "कचरा", 
    water: "पाणी",
    streetlight: "पथदिवे",
    unresolved: "अथक",
    
    // Profile
    myReports: "माझ्या तक्रारी",
    settings: "सेटिंग्ज",
    language: "भाषा",
    onlineMode: "ऑनलाइन मोड",
    offlineMode: "ऑफलाइन मोड",
    slaCountdown: "SLA: ५ दिवस बाकी",
    rateResolution: "या निवारणाचे मूल्यमापन करा",
    
    // Status and notifications
    reportSubmitted: "तक्रार यशस्वीरित्या सबमिट केली! आयडी:",
    syncComplete: "सिंक पूर्ण — तक्रार अपलोड केली",
    tamperDetected: "⚠️ त्रुटी/बदल आढळला",
    highPriority: "🔴 उच्च प्राधान्य",
    
    // Issue types
    pothole: "खड्डा",
    brokenRoad: "खराब रस्ता",
    garbagePile: "कचऱ्याचा ढीग",
    drainageIssue: "गटाराची समस्या",
    waterLogging: "पाणी साचणे",
    brokenStreetlight: "बंद पथदिवा",
    other: "इतर"
  }
};