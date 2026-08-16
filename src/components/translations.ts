export type Language = 'english' | 'hindi' | 'marathi' | 'nagpuri';

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
  
  nagpuri: {
    // Core UI strings with authentic Nagpuri (Varhadi) phrasing
    report: "तक्रार नोंदवा",
    submit: "सबमिट करा",
    savedOffline: "फोन मंधी सेव्ह झालं — नेट आल्यावर पाठवू",
    demoLabel: "आवाज़-AI डेमो — नागपूर महानगरपालिका",
    upvote: "सपोर्ट करा",
    comment: "सांगा काय वाटतं",
    map: "नकाशा",
    profile: "प्रोफाइल",
    reportAgain: "आणखी एक तक्रार",
    statusPending: "स्थिती: बाकी आहे",
    statusInProgress: "स्थिती: काम चालू हाय",
    statusResolved: "स्थिती: निवारण झालं",
    
    // Additional strings
    home: "मुख्य पान",
    requestLocation: "जागा दाखवा",
    useThisLocation: "हीच जागा ठेवा",
    selectDistrict: "भाग निवडा",
    allowLocation: "तुमचा मनपा प्रभाग ओळखायला लोकेशन चालू करा",
    detectingLocation: "जागा शोधत हाय...",
    locationDetected: "जागा सापडली:",
    manualSelection: "किंवा स्वतः निवडा:",
    selectLanguage: "भाषा निवडा",
    continue: "पुढे चला",
    
    // Report screen
    capturePhoto: "फोटो काढा किंवा अपलोड करा",
    issueType: "काय अडचण हाय?",
    severity: "त्रास किती हाय?",
    description: "सविस्तर सांगा",
    optional: "ऐच्छिक",
    recordVoiceNote: "आवाज रेकॉर्ड करा",
    location: "जागा",
    cancel: "रद्द करा",
    
    // Feed
    localFeed: "नागपूर स्थानिक फीड",
    search: "प्रभाग किंवा शब्द शोधा...",
    minutesAgo: "मिनिटां आधी",
    hoursAgo: "तासां आधी",
    daysAgo: "दिवसां आधी",
    confidence: "विश्वास",
    comments: "प्रतिक्रिया",
    viewDetails: "तपशील बघा",
    addComment: "प्रतिक्रिया लिहा...",
    postComment: "पाठवा",
    
    // Map
    allReports: "सगळं",
    road: "रस्ता",
    garbage: "कचरा",
    water: "पाणी",
    streetlight: "पथदिवे",
    unresolved: "बाकी हाय",
    
    // Profile
    myReports: "माझ्या तक्रारी",
    settings: "सेटिंग्ज",
    language: "भाषा",
    onlineMode: "ऑनलाइन मोड",
    offlineMode: "ऑफलाइन मोड",
    slaCountdown: "SLA: ५ दिवस बाकी",
    rateResolution: "काम कसं झालं सांगा",
    
    // Status and notifications
    reportSubmitted: "तक्रार पाठवली गेली! आयडी:",
    syncComplete: "सिंक पूर्ण — तक्रार गेली",
    tamperDetected: "⚠️ काहीतरी गडबड दिसली",
    highPriority: "🔴 तातडीचं काम",
    
    // Issue types
    pothole: "खड्डा",
    brokenRoad: "खराब रस्ता",
    garbagePile: "कचऱ्याचा ढीग",
    drainageIssue: "नाली जाम",
    waterLogging: "पाणी साचलं",
    brokenStreetlight: "बंद लाईट",
    other: "इतर समस्या"
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