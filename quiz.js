const QUIZ_LANG_STORAGE_KEY = "sc-training-home-lang";
const QUIZ_ROLE_STORAGE_KEY = "sc-training-is-admin";
const QUIZ_LOCATION_ACCESS_KEY = "sc-training-location-access";
const QUIZ_BANK_STORAGE_KEY = "sc-training-quiz-bank";
const QUIZ_CLIENT = "stellantis";
const SESSION_SIZE = 10;
const OPTION_LETTERS = ["A", "B", "C", "D"];

const quizUi = {
  fr: {
    pageTitle: "SC Training Platform - Quiz Special Characteristics Stellantis",
    back: "Retour au dashboard",
    clientLabel: "Client selectionne",
    clientValue: "Stellantis",
    titleKicker: "STELLANTIS",
    title: "Quiz Special Characteristics",
    subtitle: "Chaque session propose 10 questions aleatoires a partir d'une banque de 50 questions.",
    modeLabel: "Mode d'evaluation",
    startTitle: "Commencer une nouvelle session",
    startText: "Le systeme choisit automatiquement 10 questions differentes a chaque lancement pour renforcer la memorisation et la rigueur qualite.",
    readyState: "Banque de questions prete.",
    startButton: "Demarrer le quiz",
    runKicker: "Evaluation en cours",
    runTitle: "Question {current} sur {total}",
    previous: "Precedent",
    next: "Suivant",
    submit: "Afficher le resultat",
    chooseAnswer: "Veuillez selectionner une reponse avant de continuer.",
    correctFeedback: "Bonne reponse.",
    wrongFeedback: "Reponse incorrecte. La bonne reponse est {answer}.",
    resultKicker: "Resultat final",
    resultTitle: "Evaluation terminee",
    scoreLabel: "Score global",
    rateLabel: "Taux de reussite",
    answeredLabel: "Reponses corrigees",
    levelLabel: "Statut",
    resultAnswered: "{count} / {total}",
    resultRate: "{rate}%",
    resultNote: "Tableau de synthese de votre session.",
    restart: "Recommencer",
    footerTitle: "Aptiv Versigent - Quiz Special Characteristics Stellantis 2026",
    footerSubtitle: "Evaluation professionnelle multilingue dediee aux caracteristiques speciales.",
    resultMessages: {
      pass: "Resultat valide. Le participant a reussi l'evaluation des caracteristiques speciales.",
      fail: "Resultat insuffisant. Une nouvelle tentative apres revision est recommandee."
    },
    levels: {
      pass: "Reussi",
      fail: "Echoue"
    },
    sections: {
      general: "Partie 1 : Generalites",
      safety: "Partie 2 : Safety (S)",
      regulation: "Partie 3 : Reglement (R)",
      failure: "Partie 4 : Panne (P)",
      major: "Partie 5 : Majeur (M)",
      minor: "Partie 6 : Faible (F)",
      operator: "Partie 7 : Role operateur",
      practical: "Partie 8 : Cas pratiques",
      advanced: "Partie 9 : Avance",
      culture: "Partie 10 : Culture qualite"
    },
    adminKicker: "Administration",
    adminTitle: "Gestion des questions",
    adminText: "Ajoutez, modifiez ou supprimez les questions du quiz. Les utilisateurs Viewer peuvent seulement repondre.",
    adminNew: "Nouvelle question",
    adminExisting: "Questions existantes",
    adminSectionLabel: "Section",
    adminCorrectLabel: "Bonne reponse",
    adminSave: "Enregistrer",
    adminDelete: "Supprimer",
    adminStatusSaved: "La banque de questions a ete mise a jour.",
    adminStatusDeleted: "La question a ete supprimee.",
    adminStatusMissing: "Completez au minimum les champs FR et les 4 options.",
    confirmDeletePrompt: "Etes-vous sur de vouloir supprimer cet element ?"
  },
  en: {
    pageTitle: "SC Training Platform - Stellantis Special Characteristics Quiz",
    back: "Back to dashboard",
    clientLabel: "Selected client",
    clientValue: "Stellantis",
    titleKicker: "STELLANTIS",
    title: "Special Characteristics Quiz",
    subtitle: "Each session presents 10 random questions selected from a 50-question bank.",
    modeLabel: "Assessment mode",
    startTitle: "Start a new session",
    startText: "The system automatically selects 10 different questions each time to strengthen retention and quality discipline.",
    readyState: "Question bank ready.",
    startButton: "Start quiz",
    runKicker: "Assessment in progress",
    runTitle: "Question {current} of {total}",
    previous: "Previous",
    next: "Next",
    submit: "Show result",
    chooseAnswer: "Please select an answer before continuing.",
    correctFeedback: "Correct answer.",
    wrongFeedback: "Incorrect answer. The correct answer is {answer}.",
    resultKicker: "Final result",
    resultTitle: "Assessment completed",
    scoreLabel: "Overall score",
    rateLabel: "Success rate",
    answeredLabel: "Reviewed answers",
    levelLabel: "Status",
    resultAnswered: "{count} / {total}",
    resultRate: "{rate}%",
    resultNote: "Summary dashboard for your session.",
    restart: "Restart",
    footerTitle: "Aptiv Versigent - Stellantis Special Characteristics Quiz 2026",
    footerSubtitle: "Professional multilingual assessment dedicated to Special Characteristics.",
    resultMessages: {
      pass: "Validated result. The participant has passed the Special Characteristics assessment.",
      fail: "Insufficient result. A new attempt after review is recommended."
    },
    levels: {
      pass: "Passed",
      fail: "Failed"
    },
    sections: {
      general: "Part 1: General concepts",
      safety: "Part 2: Safety (S)",
      regulation: "Part 3: Regulation (R)",
      failure: "Part 4: Failure (P)",
      major: "Part 5: Major (M)",
      minor: "Part 6: Minor (F)",
      operator: "Part 7: Operator role",
      practical: "Part 8: Practical cases",
      advanced: "Part 9: Advanced",
      culture: "Part 10: Quality culture"
    },
    adminKicker: "Administration",
    adminTitle: "Question management",
    adminText: "Add, edit, or delete quiz questions. Viewer users can only answer the quiz.",
    adminNew: "New question",
    adminExisting: "Existing questions",
    adminSectionLabel: "Section",
    adminCorrectLabel: "Correct answer",
    adminSave: "Save",
    adminDelete: "Delete",
    adminStatusSaved: "The question bank has been updated.",
    adminStatusDeleted: "The question was deleted.",
    adminStatusMissing: "Please complete at least the FR question and the 4 options.",
    confirmDeletePrompt: "Are you sure you want to delete this item?"
  },
  ar: {
    pageTitle: "SC Training Platform - اختبار الميزات الخاصة Stellantis",
    back: "العودة إلى لوحة القيادة",
    clientLabel: "العميل المحدد",
    clientValue: "Stellantis",
    titleKicker: "STELLANTIS",
    title: "اختبار الميزات الخاصة",
    subtitle: "كل جلسة تعرض 10 أسئلة عشوائية من بنك مكون من 50 سؤالاً حول الميزات الخاصة.",
    modeLabel: "وضع التقييم",
    startTitle: "ابدأ جلسة جديدة",
    startText: "يقوم النظام باختيار 10 أسئلة مختلفة تلقائياً في كل مرة لتعزيز الاستيعاب والانضباط في الجودة.",
    readyState: "بنك الأسئلة جاهز.",
    startButton: "ابدأ الاختبار",
    runKicker: "التقييم قيد التنفيذ",
    runTitle: "السؤال {current} من {total}",
    previous: "السابق",
    next: "التالي",
    submit: "إظهار النتيجة",
    chooseAnswer: "يرجى اختيار إجابة قبل المتابعة.",
    correctFeedback: "إجابة صحيحة.",
    wrongFeedback: "إجابة غير صحيحة. الإجابة الصحيحة هي {answer}.",
    resultKicker: "النتيجة النهائية",
    resultTitle: "تم إنهاء التقييم",
    scoreLabel: "النتيجة العامة",
    rateLabel: "نسبة النجاح",
    answeredLabel: "الإجابات المصححة",
    levelLabel: "الحالة",
    resultAnswered: "{count} / {total}",
    resultRate: "{rate}%",
    resultNote: "لوحة ملخص خاصة بجلسة التقييم.",
    restart: "إعادة المحاولة",
    footerTitle: "Aptiv Versigent - اختبار الميزات الخاصة Stellantis 2026",
    footerSubtitle: "تقييم مهني متعدد اللغات مخصص للميزات الخاصة.",
    resultMessages: {
      pass: "نتيجة مقبولة. لقد نجح المشارك في تقييم الميزات الخاصة.",
      fail: "النتيجة غير كافية. يوصى بإعادة المحاولة بعد مراجعة التكوين."
    },
    levels: {
      pass: "ناجح",
      fail: "راسب"
    },
    sections: {
      general: "الجزء 1: معلومات عامة",
      safety: "الجزء 2: السلامة (S)",
      regulation: "الجزء 3: التنظيم (R)",
      failure: "الجزء 4: العطل (P)",
      major: "الجزء 5: جسيم (M)",
      minor: "الجزء 6: بسيط (F)",
      operator: "الجزء 7: دور المشغل",
      practical: "الجزء 8: حالات تطبيقية",
      advanced: "الجزء 9: متقدم",
      culture: "الجزء 10: ثقافة الجودة"
    }
  }
};

Object.assign(quizUi.ar, {
  adminKicker: "الإدارة",
  adminTitle: "إدارة الأسئلة",
  adminText: "أضف أو عدل أو احذف أسئلة الاختبار. يمكن لمستخدم Viewer الإجابة فقط.",
  adminNew: "سؤال جديد",
  adminExisting: "الأسئلة الموجودة",
  adminSectionLabel: "الجزء",
  adminCorrectLabel: "الإجابة الصحيحة",
  adminSave: "حفظ",
  adminDelete: "حذف",
  adminStatusSaved: "تم تحديث بنك الأسئلة.",
  adminStatusDeleted: "تم حذف السؤال.",
  adminStatusMissing: "يرجى إكمال سؤال FR والخيارات الأربع على الأقل.",
  confirmDeletePrompt: "هل أنت متأكد من رغبتك في الحذف؟"
});

const defaultQuizQuestions = [
  {
    id: 1,
    section: "general",
    correct: 1,
    fr: {
      question: "Que signifie SC ?",
      options: ["Safety Control", "Special Caracteristique", "Standard Control", "System Check"]
    },
    en: {
      question: "What does SC stand for?",
      options: ["Safety Control", "Special Characteristic", "Standard Control", "System Check"]
    },
    ar: {
      question: "ماذا يعني SC؟",
      options: ["التحكم في السلامة", "الخاصية الخاصة", "التحكم القياسي", "فحص النظام"]
    }
  },
  {
    id: 2,
    section: "general",
    correct: 1,
    fr: {
      question: "Une SC est :",
      options: ["Une machine", "Une caracteristique critique du produit ou du process", "Un document administratif", "Un outil informatique"]
    },
    en: {
      question: "An SC is:",
      options: ["A machine", "A critical product or process characteristic", "An administrative document", "An IT tool"]
    },
    ar: {
      question: "الـ SC هي:",
      options: ["آلة", "خاصية حرجة للمنتج أو للعملية", "وثيقة إدارية", "أداة معلوماتية"]
    }
  },
  {
    id: 3,
    section: "general",
    correct: 1,
    fr: {
      question: "Les SC impactent :",
      options: ["Seulement le cout", "La securite, la qualite et la conformite", "Le marketing", "Le transport"]
    },
    en: {
      question: "SCs affect:",
      options: ["Only cost", "Safety, quality and compliance", "Marketing", "Transport"]
    },
    ar: {
      question: "تؤثر الخصائص الخاصة على:",
      options: ["التكلفة فقط", "السلامة والجودة والمطابقة", "التسويق", "النقل"]
    }
  },
  {
    id: 4,
    section: "general",
    correct: 1,
    fr: {
      question: "Les SC doivent etre :",
      options: ["Facultatives", "Strictement maitrisees", "Verifiees une seule fois", "Ignorees"]
    },
    en: {
      question: "SCs must be:",
      options: ["Optional", "Strictly controlled", "Checked only once", "Ignored"]
    },
    ar: {
      question: "يجب أن تكون الخصائص الخاصة:",
      options: ["اختيارية", "متحكم فيها بدقة", "مفحوصة مرة واحدة فقط", "مهملة"]
    }
  },
  {
    id: 5,
    section: "general",
    correct: 2,
    fr: {
      question: "Qui est responsable des SC ?",
      options: ["Le chef uniquement", "L'operateur uniquement", "Toute l'equipe production et qualite", "Le client"]
    },
    en: {
      question: "Who is responsible for SCs?",
      options: ["Only the supervisor", "Only the operator", "The whole production and quality team", "The customer"]
    },
    ar: {
      question: "من المسؤول عن الخصائص الخاصة؟",
      options: ["المسؤول فقط", "المشغل فقط", "كل الفريق: الإنتاج والجودة", "العميل"]
    }
  },
  {
    id: 6,
    section: "safety",
    correct: 1,
    fr: {
      question: "S signifie :",
      options: ["Standard", "Safety", "Stock", "Systeme"]
    },
    en: {
      question: "S stands for:",
      options: ["Standard", "Safety", "Stock", "System"]
    },
    ar: {
      question: "يرمز الحرف S إلى:",
      options: ["المعيار", "السلامة", "المخزون", "النظام"]
    }
  },
  {
    id: 7,
    section: "safety",
    correct: 1,
    fr: {
      question: "Une SC de type Safety concerne :",
      options: ["Le cout", "La securite de l'utilisateur", "Le delai", "Le stock"]
    },
    en: {
      question: "A Safety-type SC concerns:",
      options: ["Cost", "User safety", "Lead time", "Inventory"]
    },
    ar: {
      question: "الـ SC من نوع Safety تتعلق بـ:",
      options: ["التكلفة", "سلامة المستخدم", "الآجال", "المخزون"]
    }
  },
  {
    id: 8,
    section: "safety",
    correct: 1,
    fr: {
      question: "Le non-respect d'une SC Safety peut entrainer :",
      options: ["Aucun impact", "Un danger pour l'utilisateur", "Un simple retard", "Une amelioration"]
    },
    en: {
      question: "Failure to comply with a Safety SC can lead to:",
      options: ["No impact", "A risk for the user", "A simple delay", "An improvement"]
    },
    ar: {
      question: "عدم احترام SC من نوع Safety قد يؤدي إلى:",
      options: ["لا تأثير", "خطر على المستخدم", "تأخير بسيط", "تحسين"]
    }
  },
  {
    id: 9,
    section: "safety",
    correct: 1,
    fr: {
      question: "Le niveau d'exigence pour Safety est :",
      options: ["Flexible", "100% conformite obligatoire", "Optionnel", "Occasionnel"]
    },
    en: {
      question: "The requirement level for Safety is:",
      options: ["Flexible", "100% mandatory compliance", "Optional", "Occasional"]
    },
    ar: {
      question: "مستوى المتطلب بالنسبة لـ Safety هو:",
      options: ["مرن", "مطابقة إلزامية 100%", "اختياري", "عرضي"]
    }
  },
  {
    id: 10,
    section: "safety",
    correct: 1,
    fr: {
      question: "Exemple de SC Safety :",
      options: ["Couleur d'un produit", "Systeme de freinage", "Etiquette", "Emballage"]
    },
    en: {
      question: "Example of a Safety SC:",
      options: ["Product color", "Braking system", "Label", "Packaging"]
    },
    ar: {
      question: "مثال على SC Safety:",
      options: ["لون المنتج", "نظام الفرامل", "الملصق", "التغليف"]
    }
  },
  {
    id: 11,
    section: "regulation",
    correct: 1,
    fr: {
      question: "Une SC de type R est associee a :",
      options: ["Le rendement", "La reglementation", "La reduction de cout", "La revision interne"]
    },
    en: {
      question: "An R-type SC is associated with:",
      options: ["Performance", "Regulation", "Cost reduction", "Internal review"]
    },
    ar: {
      question: "ترتبط SC من نوع R بـ:",
      options: ["المردودية", "التنظيم", "تقليل التكلفة", "المراجعة الداخلية"]
    }
  },
  {
    id: 12,
    section: "regulation",
    correct: 0,
    fr: {
      question: "Une SC R concerne :",
      options: ["Les lois et normes", "Le marketing", "Le transport", "Le stock"]
    },
    en: {
      question: "An R-type SC concerns:",
      options: ["Laws and standards", "Marketing", "Transport", "Inventory"]
    },
    ar: {
      question: "الـ SC من نوع R تتعلق بـ:",
      options: ["القوانين والمعايير", "التسويق", "النقل", "المخزون"]
    }
  },
  {
    id: 13,
    section: "regulation",
    correct: 1,
    fr: {
      question: "Le non-respect d'une SC R peut entrainer :",
      options: ["Une amelioration", "Des sanctions legales", "Un gain de temps", "Aucun impact"]
    },
    en: {
      question: "Failure to comply with an R-type SC can lead to:",
      options: ["An improvement", "Legal penalties", "Time savings", "No impact"]
    },
    ar: {
      question: "عدم احترام SC من نوع R قد يؤدي إلى:",
      options: ["تحسين", "عقوبات قانونية", "ربح في الوقت", "لا تأثير"]
    }
  },
  {
    id: 14,
    section: "regulation",
    correct: 1,
    fr: {
      question: "Exemple de SC R :",
      options: ["Design produit", "Norme ISO", "Couleur", "Forme"]
    },
    en: {
      question: "Example of an R-type SC:",
      options: ["Product design", "ISO standard", "Color", "Shape"]
    },
    ar: {
      question: "مثال على SC من نوع R:",
      options: ["تصميم المنتج", "معيار ISO", "اللون", "الشكل"]
    }
  },
  {
    id: 15,
    section: "regulation",
    correct: 1,
    fr: {
      question: "Les SC reglementaires doivent etre :",
      options: ["Optionnelles", "Strictement respectees", "Ignorees", "Occasionnelles"]
    },
    en: {
      question: "Regulatory SCs must be:",
      options: ["Optional", "Strictly respected", "Ignored", "Occasional"]
    },
    ar: {
      question: "يجب أن تكون SC التنظيمية:",
      options: ["اختيارية", "محترمة بدقة", "مهملة", "عرضية"]
    }
  },
  {
    id: 16,
    section: "failure",
    correct: 1,
    fr: {
      question: "P signifie :",
      options: ["Plan", "Panne", "Process", "Produit"]
    },
    en: {
      question: "P stands for:",
      options: ["Plan", "Panne (Failure)", "Process", "Product"]
    },
    ar: {
      question: "يرمز الحرف P إلى:",
      options: ["الخطة", "Panne (عطل)", "العملية", "المنتج"]
    }
  },
  {
    id: 17,
    section: "failure",
    correct: 1,
    fr: {
      question: "Une SC de type P correspond a :",
      options: ["Defaut esthetique", "Defaut empechant le fonctionnement", "Couleur", "Emballage"]
    },
    en: {
      question: "A P-type SC corresponds to:",
      options: ["Aesthetic defect", "A defect preventing operation", "Color", "Packaging"]
    },
    ar: {
      question: "الـ SC من نوع P تعني:",
      options: ["عيب جمالي", "عيب يمنع التشغيل", "اللون", "التغليف"]
    }
  },
  {
    id: 18,
    section: "failure",
    correct: 1,
    fr: {
      question: "Impact d'une panne :",
      options: ["Aucun", "Produit inutilisable", "Amelioration", "Cout reduit"]
    },
    en: {
      question: "Impact of a failure:",
      options: ["None", "The product becomes unusable", "Improvement", "Reduced cost"]
    },
    ar: {
      question: "أثر العطل هو:",
      options: ["لا شيء", "المنتج يصبح غير قابل للاستعمال", "تحسين", "تقليل التكلفة"]
    }
  },
  {
    id: 19,
    section: "failure",
    correct: 1,
    fr: {
      question: "Exemple de SC P dans un cablage :",
      options: ["Rayure legere sur la gaine", "Fil coupe dans un cable", "Etiquette mal placee", "Couleur differente du connecteur"]
    },
    en: {
      question: "Example of a P-type SC in wiring:",
      options: ["Small scratch on the sheath", "Cut wire inside a cable", "Misplaced label", "Different connector color"]
    },
    ar: {
      question: "مثال على SC من نوع P في الكابلات:",
      options: ["خدش خفيف على الغلاف", "سلك مقطوع داخل كابل", "ملصق في مكان خاطئ", "اختلاف لون الموصل"]
    }
  },
  {
    id: 20,
    section: "failure",
    correct: 2,
    fr: {
      question: "Priorite d'une SC P :",
      options: ["Faible", "Moyenne", "Elevee", "Nulle"]
    },
    en: {
      question: "Priority level of a P-type SC:",
      options: ["Low", "Medium", "High", "None"]
    },
    ar: {
      question: "أولوية SC من نوع P هي:",
      options: ["ضعيفة", "متوسطة", "مرتفعة", "منعدمة"]
    }
  },
  {
    id: 21,
    section: "major",
    correct: 1,
    fr: {
      question: "Une SC de type M demande :",
      options: ["Un suivi leger", "Une vigilance elevee", "Aucun controle", "Une verification annuelle"]
    },
    en: {
      question: "An M-type SC requires:",
      options: ["Light follow-up", "High vigilance", "No control", "Annual verification"]
    },
    ar: {
      question: "تتطلب SC من نوع M:",
      options: ["متابعة خفيفة", "يقظة عالية", "بدون مراقبة", "تحققاً سنوياً"]
    }
  },
  {
    id: 22,
    section: "major",
    correct: 2,
    fr: {
      question: "Une SC M impacte :",
      options: ["Faiblement", "Moyennement", "Fortement la qualite", "Aucun impact"]
    },
    en: {
      question: "An M-type SC affects:",
      options: ["Slightly", "Moderately", "Quality significantly", "No impact"]
    },
    ar: {
      question: "الـ SC من نوع M تؤثر:",
      options: ["بشكل ضعيف", "بشكل متوسط", "بقوة على الجودة", "بدون تأثير"]
    }
  },
  {
    id: 23,
    section: "major",
    correct: 1,
    fr: {
      question: "Exemple de SC M :",
      options: ["Petite rayure", "Mauvais assemblage", "Couleur", "Logo"]
    },
    en: {
      question: "Example of an M-type SC:",
      options: ["Small scratch", "Incorrect assembly", "Color", "Logo"]
    },
    ar: {
      question: "مثال على SC من نوع M:",
      options: ["خدش صغير", "تركيب غير صحيح", "اللون", "الشعار"]
    }
  },
  {
    id: 24,
    section: "major",
    correct: 2,
    fr: {
      question: "Gravite d'une SC M :",
      options: ["Faible", "Moyenne", "Elevee", "Nulle"]
    },
    en: {
      question: "Severity of an M-type SC:",
      options: ["Low", "Medium", "High", "None"]
    },
    ar: {
      question: "خطورة SC من نوع M هي:",
      options: ["ضعيفة", "متوسطة", "مرتفعة", "منعدمة"]
    }
  },
  {
    id: 25,
    section: "major",
    correct: 1,
    fr: {
      question: "Action face a une SC M :",
      options: ["Ignorer", "Corriger rapidement", "Continuer la production", "Reporter"]
    },
    en: {
      question: "Required action for an M-type SC:",
      options: ["Ignore it", "Correct it quickly", "Continue production", "Postpone it"]
    },
    ar: {
      question: "الإجراء أمام SC من نوع M هو:",
      options: ["تجاهلها", "تصحيحها بسرعة", "مواصلة الإنتاج", "تأجيلها"]
    }
  },
  {
    id: 26,
    section: "minor",
    correct: 1,
    fr: {
      question: "La categorie F indique :",
      options: ["Un impact fort", "Un impact faible", "Une panne totale", "Une exigence reglementaire"]
    },
    en: {
      question: "The F category indicates:",
      options: ["A high impact", "A low impact", "A complete failure", "A regulatory requirement"]
    },
    ar: {
      question: "تشير الفئة F إلى:",
      options: ["تأثير قوي", "تأثير ضعيف", "عطل كامل", "متطلب تنظيمي"]
    }
  },
  {
    id: 27,
    section: "minor",
    correct: 1,
    fr: {
      question: "Une SC F correspond a :",
      options: ["Defaut critique", "Defaut mineur", "Danger", "Panne"]
    },
    en: {
      question: "An F-type SC corresponds to:",
      options: ["Critical defect", "Minor defect", "Danger", "Failure"]
    },
    ar: {
      question: "الـ SC من نوع F تعني:",
      options: ["عيب حرج", "عيب بسيط", "خطر", "عطل"]
    }
  },
  {
    id: 28,
    section: "minor",
    correct: 2,
    fr: {
      question: "Impact d'une SC F :",
      options: ["Eleve", "Moyen", "Faible", "Critique"]
    },
    en: {
      question: "Impact of an F-type SC:",
      options: ["High", "Medium", "Low", "Critical"]
    },
    ar: {
      question: "أثر SC من نوع F هو:",
      options: ["مرتفع", "متوسط", "ضعيف", "حرج"]
    }
  },
  {
    id: 29,
    section: "minor",
    correct: 1,
    fr: {
      question: "Exemple de SC F :",
      options: ["Defaut securite", "Petite rayure", "Panne moteur", "Non-conformite legale"]
    },
    en: {
      question: "Example of an F-type SC:",
      options: ["Safety defect", "Small scratch", "Engine failure", "Legal non-compliance"]
    },
    ar: {
      question: "مثال على SC من نوع F:",
      options: ["عيب سلامة", "خدش صغير", "عطل بالمحرك", "عدم مطابقة قانونية"]
    }
  },
  {
    id: 30,
    section: "minor",
    correct: 1,
    fr: {
      question: "Traitement d'une SC F :",
      options: ["Arret immediat", "Suivi simple", "Bloquer la production", "Urgence critique"]
    },
    en: {
      question: "Treatment of an F-type SC:",
      options: ["Immediate stop", "Simple follow-up", "Block production", "Critical emergency"]
    },
    ar: {
      question: "معالجة SC من نوع F تكون:",
      options: ["توقف فوري", "متابعة بسيطة", "إيقاف الإنتاج", "حالة طارئة حرجة"]
    }
  },
  {
    id: 31,
    section: "operator",
    correct: 1,
    fr: {
      question: "L'operateur doit :",
      options: ["Ignorer les SC", "Respecter les SC", "Modifier les SC", "Supprimer les SC"]
    },
    en: {
      question: "The operator must:",
      options: ["Ignore SCs", "Respect SCs", "Modify SCs", "Remove SCs"]
    },
    ar: {
      question: "يجب على المشغل أن:",
      options: ["يتجاهل SC", "يحترم SC", "يغير SC", "يحذف SC"]
    }
  },
  {
    id: 32,
    section: "operator",
    correct: 1,
    fr: {
      question: "En cas de probleme SC :",
      options: ["Continuer", "Arreter et alerter", "Ignorer", "Cacher"]
    },
    en: {
      question: "In case of an SC issue:",
      options: ["Continue", "Stop and alert", "Ignore it", "Hide it"]
    },
    ar: {
      question: "في حالة وجود مشكلة SC:",
      options: ["الاستمرار", "التوقف والتنبيه", "التجاهل", "الإخفاء"]
    }
  },
  {
    id: 33,
    section: "operator",
    correct: 1,
    fr: {
      question: "Le controle des SC doit etre :",
      options: ["Occasionnel", "Regulier et rigoureux", "Rare", "Inutile"]
    },
    en: {
      question: "SC control must be:",
      options: ["Occasional", "Regular and rigorous", "Rare", "Unnecessary"]
    },
    ar: {
      question: "يجب أن يكون التحكم في SC:",
      options: ["عرضياً", "منتظماً وصارماً", "نادراً", "غير ضروري"]
    }
  },
  {
    id: 34,
    section: "operator",
    correct: 3,
    fr: {
      question: "L'operateur contribue a :",
      options: ["La qualite", "La securite", "La production", "Tous les elements"]
    },
    en: {
      question: "The operator contributes to:",
      options: ["Quality", "Safety", "Production", "All of the above"]
    },
    ar: {
      question: "يساهم المشغل في:",
      options: ["الجودة", "السلامة", "الإنتاج", "كل هذه العناصر"]
    }
  },
  {
    id: 35,
    section: "operator",
    correct: 1,
    fr: {
      question: "Une anomalie SC doit etre :",
      options: ["Cachee", "Corrigee et signalee", "Ignoree", "Acceptee"]
    },
    en: {
      question: "An SC abnormality must be:",
      options: ["Hidden", "Corrected and reported", "Ignored", "Accepted"]
    },
    ar: {
      question: "يجب أن تكون أي حالة شذوذ SC:",
      options: ["مخفية", "مصححة ومبلغا عنها", "متجاهلة", "مقبولة"]
    }
  },
  {
    id: 36,
    section: "practical",
    correct: 2,
    fr: {
      question: "Exemple dans le cablage : court-circuit possible ->",
      options: ["F", "M", "S", "R"]
    },
    en: {
      question: "Example in wiring: possible short circuit ->",
      options: ["F", "M", "S", "R"]
    },
    ar: {
      question: "مثال في الكابلات: احتمال حدوث تماس كهربائي ->",
      options: ["F", "M", "S", "R"]
    }
  },
  {
    id: 37,
    section: "practical",
    correct: 1,
    fr: {
      question: "Non-respect norme ->",
      options: ["F", "R", "M", "P"]
    },
    en: {
      question: "Non-compliance with a standard ->",
      options: ["F", "R", "M", "P"]
    },
    ar: {
      question: "عدم احترام معيار ->",
      options: ["F", "R", "M", "P"]
    }
  },
  {
    id: 38,
    section: "practical",
    correct: 1,
    fr: {
      question: "Produit ne fonctionne pas ->",
      options: ["F", "P", "M", "R"]
    },
    en: {
      question: "Product does not work ->",
      options: ["F", "P", "M", "R"]
    },
    ar: {
      question: "المنتج لا يعمل ->",
      options: ["F", "P", "M", "R"]
    }
  },
  {
    id: 39,
    section: "practical",
    correct: 2,
    fr: {
      question: "Defaut visuel leger ->",
      options: ["S", "R", "F", "P"]
    },
    en: {
      question: "Minor visual defect ->",
      options: ["S", "R", "F", "P"]
    },
    ar: {
      question: "عيب بصري خفيف ->",
      options: ["S", "R", "F", "P"]
    }
  },
  {
    id: 40,
    section: "practical",
    correct: 1,
    fr: {
      question: "Mauvais assemblage critique ->",
      options: ["F", "M", "R", "S"]
    },
    en: {
      question: "Critical assembly defect ->",
      options: ["F", "M", "R", "S"]
    },
    ar: {
      question: "خلل تجميع حرج ->",
      options: ["F", "M", "R", "S"]
    }
  },
  {
    id: 41,
    section: "advanced",
    correct: 1,
    fr: {
      question: "Les SC sont precisees dans :",
      options: ["Marketing", "Instructions de travail", "RH", "Stock"]
    },
    en: {
      question: "SCs are specified in:",
      options: ["Marketing", "Work instructions", "HR", "Inventory"]
    },
    ar: {
      question: "يتم توضيح SC في:",
      options: ["التسويق", "تعليمات العمل", "الموارد البشرية", "المخزون"]
    }
  },
  {
    id: 42,
    section: "advanced",
    correct: 0,
    fr: {
      question: "La tracabilite d'une SC permet de :",
      options: ["Suivre et prouver la conformite", "Changer la couleur du produit", "Reduire le nombre de controles", "Supprimer la documentation"]
    },
    en: {
      question: "SC traceability makes it possible to:",
      options: ["Track and prove compliance", "Change the product color", "Reduce the number of checks", "Remove documentation"]
    },
    ar: {
      question: "تسمح قابلية تتبع SC بـ:",
      options: ["تتبع المطابقة وإثباتها", "تغيير لون المنتج", "تقليل عدد المراقبات", "حذف التوثيق"]
    }
  },
  {
    id: 43,
    section: "advanced",
    correct: 1,
    fr: {
      question: "Les SC permettent de :",
      options: ["Reduire la qualite", "Maitriser la qualite", "Ignorer les defauts", "Reduire la production"]
    },
    en: {
      question: "SCs make it possible to:",
      options: ["Reduce quality", "Control quality", "Ignore defects", "Reduce production"]
    },
    ar: {
      question: "تمكن SC من:",
      options: ["تقليل الجودة", "التحكم في الجودة", "تجاهل العيوب", "تقليل الإنتاج"]
    }
  },
  {
    id: 44,
    section: "advanced",
    correct: 1,
    fr: {
      question: "Les SC critiques exigent :",
      options: ["Peu de controle", "Controle strict", "Aucun controle", "Controle annuel"]
    },
    en: {
      question: "Critical SCs require:",
      options: ["Very little control", "Strict control", "No control", "Annual control"]
    },
    ar: {
      question: "تتطلب SC الحرجة:",
      options: ["قليلاً من المراقبة", "مراقبة صارمة", "بدون مراقبة", "مراقبة سنوية"]
    }
  },
  {
    id: 45,
    section: "advanced",
    correct: 3,
    fr: {
      question: "La documentation SC inclut :",
      options: ["Plan de controle", "Instructions de travail", "FMEA", "Tous les elements"]
    },
    en: {
      question: "SC documentation includes:",
      options: ["Control plan", "Work instructions", "FMEA", "All of the above"]
    },
    ar: {
      question: "تشمل وثائق SC:",
      options: ["خطة المراقبة", "تعليمات العمل", "FMEA", "كل العناصر"]
    }
  },
  {
    id: 46,
    section: "culture",
    correct: 1,
    fr: {
      question: "Les SC contribuent a :",
      options: ["Mauvaise qualite", "Satisfaction client", "Retard", "Cout inutile"]
    },
    en: {
      question: "SCs contribute to:",
      options: ["Poor quality", "Customer satisfaction", "Delay", "Unnecessary cost"]
    },
    ar: {
      question: "تساهم SC في:",
      options: ["جودة سيئة", "رضا العميل", "التأخير", "تكلفة غير ضرورية"]
    }
  },
  {
    id: 47,
    section: "culture",
    correct: 1,
    fr: {
      question: "Ignorer les SC entraine :",
      options: ["Succes", "Risques qualite et securite", "Gain de temps", "Performance"]
    },
    en: {
      question: "Ignoring SCs leads to:",
      options: ["Success", "Quality and safety risks", "Time savings", "Performance"]
    },
    ar: {
      question: "تجاهل SC يؤدي إلى:",
      options: ["النجاح", "مخاطر على الجودة والسلامة", "ربح الوقت", "الأداء"]
    }
  },
  {
    id: 48,
    section: "culture",
    correct: 1,
    fr: {
      question: "Les SC sont essentielles pour :",
      options: ["Decoration", "Qualite produit", "Marketing", "Transport"]
    },
    en: {
      question: "SCs are essential for:",
      options: ["Decoration", "Product quality", "Marketing", "Transport"]
    },
    ar: {
      question: "تعتبر SC أساسية من أجل:",
      options: ["الزينة", "جودة المنتج", "التسويق", "النقل"]
    }
  },
  {
    id: 49,
    section: "culture",
    correct: 0,
    fr: {
      question: "Les SC necessitent :",
      options: ["Discipline et rigueur", "Negligence", "Rapidité uniquement", "Hasard"]
    },
    en: {
      question: "SCs require:",
      options: ["Discipline and rigor", "Negligence", "Speed only", "Chance"]
    },
    ar: {
      question: "تتطلب SC:",
      options: ["الانضباط والصرامة", "الإهمال", "السرعة فقط", "الصدفة"]
    }
  },
  {
    id: 50,
    section: "culture",
    correct: 1,
    fr: {
      question: "Objectif final des SC :",
      options: ["Reduire l'effort", "Garantir qualite et securite", "Augmenter les defauts", "Reduire le controle"]
    },
    en: {
      question: "Final objective of SCs:",
      options: ["Reduce effort", "Guarantee quality and safety", "Increase defects", "Reduce control"]
    },
    ar: {
      question: "الهدف النهائي من SC هو:",
      options: ["تقليل الجهد", "ضمان الجودة والسلامة", "زيادة العيوب", "تقليل المراقبة"]
    }
  }
];

const elements = {
  html: document.documentElement,
  langButtons: Array.from(document.querySelectorAll(".lang-btn")),
  backLinks: [
    document.getElementById("quizBackAction"),
    document.getElementById("quizResultBack")
  ],
  clientLabel: document.getElementById("quizClientLabel"),
  clientValue: document.getElementById("quizClientValue"),
  titleKicker: document.getElementById("quizTitleKicker"),
  pageTitle: document.getElementById("quizPageTitle"),
  pageSubtitle: document.getElementById("quizPageSubtitle"),
  modeLabel: document.getElementById("quizModeLabel"),
  startTitle: document.getElementById("quizStartTitle"),
  startText: document.getElementById("quizStartText"),
  readyState: document.getElementById("quizReadyState"),
  startButton: document.getElementById("quizStartBtn"),
  startPanel: document.getElementById("quizStartPanel"),
  runPanel: document.getElementById("quizRunPanel"),
  resultPanel: document.getElementById("quizResultPanel"),
  runKicker: document.getElementById("quizRunKicker"),
  runTitle: document.getElementById("quizRunTitle"),
  sectionBadge: document.getElementById("quizSectionBadge"),
  progressBar: document.getElementById("quizProgressBar"),
  questionText: document.getElementById("quizQuestionText"),
  options: document.getElementById("quizOptions"),
  inlineMessage: document.getElementById("quizInlineMessage"),
  prevButton: document.getElementById("quizPrevBtn"),
  nextButton: document.getElementById("quizNextBtn"),
  submitButton: document.getElementById("quizSubmitBtn"),
  resultKicker: document.getElementById("quizResultKicker"),
  resultTitle: document.getElementById("quizResultTitle"),
  resultScore: document.getElementById("quizResultScore"),
  resultMessage: document.getElementById("quizResultMessage"),
  scoreLabel: document.getElementById("quizScoreLabel"),
  rateLabel: document.getElementById("quizRateLabel"),
  answeredLabel: document.getElementById("quizAnsweredLabel"),
  levelLabel: document.getElementById("quizLevelLabel"),
  resultAnswered: document.getElementById("quizResultAnswered"),
  resultRate: document.getElementById("quizResultRate"),
  resultLevel: document.getElementById("quizResultLevel"),
  resultStatusCard: document.getElementById("quizResultStatusCard"),
  resultNote: document.getElementById("quizResultNote"),
  restartButton: document.getElementById("quizRestartBtn"),
  footerTitle: document.getElementById("quizFooterTitle"),
  footerSubtitle: document.getElementById("quizFooterSubtitle"),
  adminPanel: document.getElementById("quizAdminPanel"),
  adminKicker: document.getElementById("quizAdminKicker"),
  adminTitle: document.getElementById("quizAdminTitle"),
  adminText: document.getElementById("quizAdminText"),
  adminResetButton: document.getElementById("quizAdminResetBtn"),
  adminListLabel: document.getElementById("quizAdminListLabel"),
  adminQuestionSelect: document.getElementById("quizAdminQuestionSelect"),
  adminSectionLabel: document.getElementById("quizAdminSectionLabel"),
  adminSectionSelect: document.getElementById("quizAdminSectionSelect"),
  adminCorrectLabel: document.getElementById("quizAdminCorrectLabel"),
  adminCorrectSelect: document.getElementById("quizAdminCorrectSelect"),
  adminSaveButton: document.getElementById("quizAdminSaveBtn"),
  adminDeleteButton: document.getElementById("quizAdminDeleteBtn"),
  adminStatus: document.getElementById("quizAdminStatus"),
  adminQuestionFr: document.getElementById("quizAdminQuestionFr"),
  adminQuestionEn: document.getElementById("quizAdminQuestionEn"),
  adminQuestionAr: document.getElementById("quizAdminQuestionAr"),
  adminOptionFr: [0, 1, 2, 3].map((index) => document.getElementById(`quizAdminOptionFr${index}`)),
  adminOptionEn: [0, 1, 2, 3].map((index) => document.getElementById(`quizAdminOptionEn${index}`)),
  adminOptionAr: [0, 1, 2, 3].map((index) => document.getElementById(`quizAdminOptionAr${index}`))
};

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function setValue(element, value) {
  if (element) {
    element.value = value;
  }
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function getInitialLanguage() {
  const saved = localStorage.getItem(QUIZ_LANG_STORAGE_KEY);
  if (saved && quizUi[saved]) {
    return saved;
  }
  return "fr";
}

function isAdmin() {
  return localStorage.getItem(QUIZ_ROLE_STORAGE_KEY) === "true";
}

function requireQuizAccess() {
  if (sessionStorage.getItem(QUIZ_LOCATION_ACCESS_KEY) === "granted") {
    return true;
  }

  window.location.replace("./index.html");
  return false;
}

function getDefaultQuestionBank() {
  return cloneData(defaultQuizQuestions);
}

function normalizeQuestion(question, fallbackId) {
  const safeQuestion = question && typeof question === "object" ? question : {};
  const id = Number(safeQuestion.id) || fallbackId;
  const sections = quizUi.fr.sections;
  const section = sections[safeQuestion.section] ? safeQuestion.section : "general";
  const correct = Math.max(0, Math.min(3, Number(safeQuestion.correct) || 0));
  const frQuestion = String(safeQuestion.fr?.question || "").trim();
  const frOptions = Array.isArray(safeQuestion.fr?.options) ? safeQuestion.fr.options.slice(0, 4) : [];

  const buildTranslation = (lang, fallbackQuestion, fallbackOptions) => {
    const source = safeQuestion[lang] || {};
    const questionText = String(source.question || fallbackQuestion || "").trim();
    const options = Array.from({ length: 4 }, (_, index) => {
      return String((source.options && source.options[index]) || fallbackOptions[index] || "").trim();
    });

    return {
      question: questionText,
      options
    };
  };

  return {
    id,
    section,
    correct,
    fr: buildTranslation("fr", frQuestion, frOptions),
    en: buildTranslation("en", frQuestion, frOptions),
    ar: buildTranslation("ar", frQuestion, frOptions)
  };
}

function loadQuestionBank() {
  try {
    const stored = JSON.parse(localStorage.getItem(QUIZ_BANK_STORAGE_KEY) || "null");
    if (!Array.isArray(stored) || !stored.length) {
      return getDefaultQuestionBank();
    }

    return stored.map((question, index) => normalizeQuestion(question, index + 1));
  } catch {
    return getDefaultQuestionBank();
  }
}

function saveQuestionBank(questionBank) {
  localStorage.setItem(QUIZ_BANK_STORAGE_KEY, JSON.stringify(questionBank));
}

function confirmDeleteAction() {
  return window.confirm(quizUi[currentLang].confirmDeletePrompt);
}

function formatText(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

function shuffle(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

let currentLang = getInitialLanguage();
let quizQuestionBank = loadQuestionBank();
let activeQuestions = [];
let answers = [];
let revealedAnswers = [];
let currentQuestionIndex = 0;
let selectedAdminQuestionId = "";

function setPanelVisibility() {
  elements.startPanel.classList.toggle("hidden", activeQuestions.length > 0);
  elements.runPanel.classList.toggle("hidden", activeQuestions.length === 0);
  elements.resultPanel.classList.add("hidden");
}

function setAdminStatus(copyKey = "") {
  if (!elements.adminStatus) {
    return;
  }

  elements.adminStatus.textContent = copyKey ? quizUi[currentLang][copyKey] : "";
}

function resetAdminForm() {
  selectedAdminQuestionId = "";
  setValue(elements.adminQuestionSelect, "");
  setValue(elements.adminSectionSelect, "general");
  setValue(elements.adminCorrectSelect, "0");
  setValue(elements.adminQuestionFr, "");
  setValue(elements.adminQuestionEn, "");
  setValue(elements.adminQuestionAr, "");
  elements.adminOptionFr.forEach((input) => setValue(input, ""));
  elements.adminOptionEn.forEach((input) => setValue(input, ""));
  elements.adminOptionAr.forEach((input) => setValue(input, ""));
}

function getQuestionById(questionId) {
  return quizQuestionBank.find((question) => String(question.id) === String(questionId)) || null;
}

function renderAdminQuestionSelect() {
  if (!elements.adminQuestionSelect) {
    return;
  }

  elements.adminQuestionSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = quizUi[currentLang].adminNew;
  elements.adminQuestionSelect.appendChild(placeholder);

  quizQuestionBank
    .slice()
    .sort((first, second) => first.id - second.id)
    .forEach((question) => {
      const option = document.createElement("option");
      option.value = String(question.id);
      option.textContent = `#${question.id} - ${question.fr.question}`;
      elements.adminQuestionSelect.appendChild(option);
    });

  elements.adminQuestionSelect.value = selectedAdminQuestionId ? String(selectedAdminQuestionId) : "";
}

function renderAdminSectionOptions() {
  if (!elements.adminSectionSelect) {
    return;
  }

  const selectedSection = elements.adminSectionSelect.value || "general";
  elements.adminSectionSelect.innerHTML = "";
  Object.entries(quizUi[currentLang].sections).forEach(([sectionKey, sectionLabel]) => {
    const option = document.createElement("option");
    option.value = sectionKey;
    option.textContent = sectionLabel;
    elements.adminSectionSelect.appendChild(option);
  });
  elements.adminSectionSelect.value = quizUi[currentLang].sections[selectedSection] ? selectedSection : "general";
}

function fillAdminForm(question) {
  if (!question) {
    resetAdminForm();
    return;
  }

  selectedAdminQuestionId = String(question.id);
  setValue(elements.adminQuestionSelect, selectedAdminQuestionId);
  setValue(elements.adminSectionSelect, question.section);
  setValue(elements.adminCorrectSelect, String(question.correct));
  setValue(elements.adminQuestionFr, question.fr.question);
  setValue(elements.adminQuestionEn, question.en.question);
  setValue(elements.adminQuestionAr, question.ar.question);
  elements.adminOptionFr.forEach((input, index) => setValue(input, question.fr.options[index] || ""));
  elements.adminOptionEn.forEach((input, index) => setValue(input, question.en.options[index] || ""));
  elements.adminOptionAr.forEach((input, index) => setValue(input, question.ar.options[index] || ""));
}

function buildTranslation(questionInput, optionInputs, fallbackTranslation) {
  const questionText = String(questionInput?.value || "").trim() || fallbackTranslation.question;
  const options = optionInputs.map((input, index) => {
    return String(input?.value || "").trim() || fallbackTranslation.options[index] || "";
  });

  return {
    question: questionText,
    options
  };
}

function buildQuestionFromForm() {
  const frTranslation = {
    question: String(elements.adminQuestionFr?.value || "").trim(),
    options: elements.adminOptionFr.map((input) => String(input?.value || "").trim())
  };

  if (!frTranslation.question || frTranslation.options.some((option) => !option)) {
    return null;
  }

  return normalizeQuestion(
    {
      id: selectedAdminQuestionId ? Number(selectedAdminQuestionId) : null,
      section: elements.adminSectionSelect?.value || "general",
      correct: Number(elements.adminCorrectSelect?.value || 0),
      fr: frTranslation,
      en: buildTranslation(elements.adminQuestionEn, elements.adminOptionEn, frTranslation),
      ar: buildTranslation(elements.adminQuestionAr, elements.adminOptionAr, frTranslation)
    },
    quizQuestionBank.reduce((maxId, question) => Math.max(maxId, Number(question.id) || 0), 0) + 1
  );
}

function renderAdminPanel() {
  if (!elements.adminPanel) {
    return;
  }

  elements.adminPanel.classList.toggle("hidden", !isAdmin());
  if (!isAdmin()) {
    return;
  }

  renderAdminSectionOptions();
  renderAdminQuestionSelect();
}

function saveAdminQuestion() {
  const nextQuestion = buildQuestionFromForm();
  if (!nextQuestion) {
    setAdminStatus("adminStatusMissing");
    return;
  }

  const existingIndex = quizQuestionBank.findIndex((question) => String(question.id) === String(nextQuestion.id));
  if (existingIndex >= 0) {
    quizQuestionBank.splice(existingIndex, 1, nextQuestion);
  } else {
    quizQuestionBank.push(nextQuestion);
  }

  quizQuestionBank.sort((first, second) => first.id - second.id);
  saveQuestionBank(quizQuestionBank);
  fillAdminForm(nextQuestion);
  renderAdminPanel();
  setAdminStatus("adminStatusSaved");
}

function deleteAdminQuestion() {
  if (!selectedAdminQuestionId) {
    resetAdminForm();
    return;
  }

  if (!confirmDeleteAction()) {
    return;
  }

  quizQuestionBank = quizQuestionBank.filter((question) => String(question.id) !== String(selectedAdminQuestionId));
  if (!quizQuestionBank.length) {
    quizQuestionBank = getDefaultQuestionBank();
  }

  saveQuestionBank(quizQuestionBank);
  resetAdminForm();
  renderAdminPanel();
  setAdminStatus("adminStatusDeleted");
}

function setLanguage(lang) {
  if (!quizUi[lang]) {
    return;
  }

  currentLang = lang;
  localStorage.setItem(QUIZ_LANG_STORAGE_KEY, lang);

  const copy = quizUi[lang];
  const isArabic = lang === "ar";
  elements.html.lang = lang;
  elements.html.dir = isArabic ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", isArabic);
  document.title = copy.pageTitle;

  elements.langButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });

  elements.backLinks.forEach((link) => {
    if (link) {
      link.textContent = copy.back;
      link.href = `./dashboard.html?client=${QUIZ_CLIENT}`;
    }
  });

  setText(elements.clientLabel, copy.clientLabel);
  setText(elements.clientValue, copy.clientValue);
  setText(elements.titleKicker, copy.titleKicker);
  setText(elements.pageTitle, copy.title);
  setText(elements.pageSubtitle, copy.subtitle);
  setText(elements.modeLabel, copy.modeLabel);
  setText(elements.startTitle, copy.startTitle);
  setText(elements.startText, copy.startText);
  setText(elements.readyState, copy.readyState);
  setText(elements.startButton, copy.startButton);
  setText(elements.runKicker, copy.runKicker);
  setText(elements.prevButton, copy.previous);
  setText(elements.nextButton, copy.next);
  setText(elements.submitButton, copy.submit);
  setText(elements.resultKicker, copy.resultKicker);
  setText(elements.resultTitle, copy.resultTitle);
  setText(elements.scoreLabel, copy.scoreLabel);
  setText(elements.rateLabel, copy.rateLabel);
  setText(elements.answeredLabel, copy.answeredLabel);
  setText(elements.levelLabel, copy.levelLabel);
  setText(elements.resultNote, copy.resultNote);
  setText(elements.restartButton, copy.restart);
  setText(elements.footerTitle, copy.footerTitle);
  setText(elements.footerSubtitle, copy.footerSubtitle);
  setText(elements.adminKicker, copy.adminKicker);
  setText(elements.adminTitle, copy.adminTitle);
  setText(elements.adminText, copy.adminText);
  setText(elements.adminResetButton, copy.adminNew);
  setText(elements.adminListLabel, copy.adminExisting);
  setText(elements.adminSectionLabel, copy.adminSectionLabel);
  setText(elements.adminCorrectLabel, copy.adminCorrectLabel);
  setText(elements.adminSaveButton, copy.adminSave);
  setText(elements.adminDeleteButton, copy.adminDelete);

  renderAdminPanel();
  if (selectedAdminQuestionId) {
    fillAdminForm(getQuestionById(selectedAdminQuestionId));
  }

  if (activeQuestions.length > 0) {
    renderQuestion();
  }
}

function startQuiz() {
  activeQuestions = shuffle(quizQuestionBank).slice(0, Math.min(SESSION_SIZE, quizQuestionBank.length));
  answers = new Array(activeQuestions.length).fill(null);
  revealedAnswers = new Array(activeQuestions.length).fill(false);
  currentQuestionIndex = 0;
  elements.inlineMessage.textContent = "";
  setPanelVisibility();
  renderQuestion();
}

function renderQuestion() {
  const copy = quizUi[currentLang];
  const question = activeQuestions[currentQuestionIndex];
  const translation = question[currentLang];
  const selectedAnswer = answers[currentQuestionIndex];
  const isRevealed = revealedAnswers[currentQuestionIndex];

  elements.runTitle.textContent = formatText(copy.runTitle, {
    current: currentQuestionIndex + 1,
    total: activeQuestions.length
  });
  elements.sectionBadge.textContent = copy.sections[question.section];
  elements.progressBar.style.width = `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%`;
  elements.questionText.textContent = translation.question;
  if (isRevealed) {
    const isCorrect = selectedAnswer === question.correct;
    elements.inlineMessage.textContent = isCorrect
      ? copy.correctFeedback
      : formatText(copy.wrongFeedback, { answer: OPTION_LETTERS[question.correct] });
    elements.inlineMessage.classList.toggle("is-correct", isCorrect);
    elements.inlineMessage.classList.toggle("is-wrong", !isCorrect);
  } else {
    elements.inlineMessage.textContent = "";
    elements.inlineMessage.classList.remove("is-correct", "is-wrong");
  }

  elements.options.innerHTML = "";
  translation.options.forEach((option, optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    if (selectedAnswer === optionIndex) {
      button.classList.add("is-selected");
    }
    if (isRevealed && optionIndex === question.correct) {
      button.classList.add("is-correct");
    }
    if (isRevealed && selectedAnswer === optionIndex && optionIndex !== question.correct) {
      button.classList.add("is-wrong");
    }
    button.dataset.optionIndex = String(optionIndex);
    button.disabled = isRevealed;
    button.textContent = option;
    button.addEventListener("click", () => {
      if (revealedAnswers[currentQuestionIndex]) {
        return;
      }
      answers[currentQuestionIndex] = optionIndex;
      revealedAnswers[currentQuestionIndex] = true;
      renderQuestion();
    });
    elements.options.appendChild(button);
  });

  elements.prevButton.disabled = currentQuestionIndex === 0;
  elements.nextButton.classList.toggle("hidden", currentQuestionIndex === activeQuestions.length - 1);
  elements.submitButton.classList.toggle("hidden", currentQuestionIndex !== activeQuestions.length - 1);
}

function requireAnswer() {
  if (answers[currentQuestionIndex] !== null) {
    return true;
  }
  elements.inlineMessage.textContent = quizUi[currentLang].chooseAnswer;
  elements.inlineMessage.classList.remove("is-correct");
  elements.inlineMessage.classList.add("is-wrong");
  return false;
}

function showResult() {
  const score = activeQuestions.reduce((total, question, index) => {
    return total + (answers[index] === question.correct ? 1 : 0);
  }, 0);
  const rate = Math.round((score / activeQuestions.length) * 100);
  const copy = quizUi[currentLang];
  const performanceKey = score >= 9 ? "pass" : "fail";

  elements.runPanel.classList.add("hidden");
  elements.resultPanel.classList.remove("hidden");
  elements.resultScore.textContent = `${score} / ${activeQuestions.length}`;
  elements.resultAnswered.textContent = formatText(copy.resultAnswered, {
    count: score,
    total: activeQuestions.length
  });
  elements.resultRate.textContent = formatText(copy.resultRate, { rate });
  elements.resultLevel.textContent = copy.levels[performanceKey];
  elements.resultMessage.textContent = copy.resultMessages[performanceKey];
  elements.resultStatusCard.classList.toggle("is-pass", performanceKey === "pass");
  elements.resultStatusCard.classList.toggle("is-fail", performanceKey === "fail");
}

elements.langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang || "fr");
  });
});

elements.startButton.addEventListener("click", startQuiz);
elements.restartButton.addEventListener("click", startQuiz);

elements.prevButton.addEventListener("click", () => {
  if (currentQuestionIndex === 0) {
    return;
  }
  currentQuestionIndex -= 1;
  renderQuestion();
});

elements.nextButton.addEventListener("click", () => {
  if (!requireAnswer()) {
    return;
  }
  if (currentQuestionIndex < activeQuestions.length - 1) {
    currentQuestionIndex += 1;
    renderQuestion();
  }
});

elements.submitButton.addEventListener("click", () => {
  if (!requireAnswer()) {
    return;
  }
  showResult();
});

if (elements.adminResetButton) {
  elements.adminResetButton.addEventListener("click", () => {
    resetAdminForm();
    setAdminStatus("");
  });
}

if (elements.adminQuestionSelect) {
  elements.adminQuestionSelect.addEventListener("change", () => {
    selectedAdminQuestionId = elements.adminQuestionSelect.value || "";
    fillAdminForm(getQuestionById(selectedAdminQuestionId));
    setAdminStatus("");
  });
}

if (elements.adminSaveButton) {
  elements.adminSaveButton.addEventListener("click", saveAdminQuestion);
}

if (elements.adminDeleteButton) {
  elements.adminDeleteButton.addEventListener("click", deleteAdminQuestion);
}

if (requireQuizAccess()) {
  setLanguage(currentLang);
  renderAdminPanel();
  resetAdminForm();
  setPanelVisibility();
}
