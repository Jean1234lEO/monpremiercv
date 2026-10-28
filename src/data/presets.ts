import { CVData, PresetCV } from '../types';

export const initialCVData: CVData = {
  name: "Jean Dupont",
  jobTitle: "Technicien en électricité",
  email: "jean@email.com",
  phone: "+229 01 00 00 00 00",
  city: "Cotonou, Bénin",
  linkedin: "",
  website: "",
  profile: "Jeune diplômé en génie électrique, rigoureux et passionné par la maintenance des installations électriques et les énergies renouvelables. Désireux de mettre mes compétences pratiques au service d'une entreprise innovante.",
  education: "Licence professionnelle en génie électrique — Université Polytechnique — 2026\nBaccalauréat scientifique (Série D) — Lycée Moderne — 2023",
  skills: "• Câblage et raccordement de tableaux électriques\n• Diagnostic et maintenance préventive d'équipements\n• Lecture et conception de schémas électriques (AutoCAD)\n• Notions en sécurité électrique et habilitation basse tension\n• Maîtrise de la suite bureautique (Excel, Word)",
  projects: "Projet de fin d'études (Mémoire) :\nConception et dimensionnement d'une installation solaire photovoltaïque pour un bâtiment tertiaire. Étude du profil de consommation, sélection des onduleurs et simulation du rendement énergétique.",
  experience: "Stage académique en maintenance électrique — Société Énergie Plus (2 mois)\n• Participation au dépannage et aux contrôles de routine des disjoncteurs et transformateurs.\n• Rédaction des rapports d'intervention technique sous supervision de l'ingénieur en chef.\n\nTravaux pratiques & Ateliers d'ingénierie :\n• Réalisation de maquettes d'automatismes programmables et tests de sécurité.",
  languages: "Français : langue maternelle (courant)\nAnglais : niveau technique / intermédiaire (B1)",
  interests: "Énergies vertes, bricolage électronique, pratique du football en club universitaire.",
  photo: ""
};

export const emptyCVData: CVData = {
  name: "",
  jobTitle: "",
  email: "",
  phone: "",
  city: "",
  linkedin: "",
  website: "",
  profile: "",
  education: "",
  skills: "",
  projects: "",
  experience: "",
  languages: "",
  interests: "",
  photo: ""
};

export const presets: PresetCV[] = [
  {
    id: "electricien",
    title: "Technicien en Électricité",
    subtitle: "Jeune diplômé / Travaux techniques",
    category: "Technique & Ingénierie",
    data: initialCVData
  },
  {
    id: "developpeur",
    title: "Développeur Web Junior",
    subtitle: "Étudiant en informatique / Projets personnels",
    category: "Numérique & Tech",
    data: {
      name: "Lucas Moreau",
      jobTitle: "Développeur Front-End Junior (Recherche de Stage)",
      email: "lucas.moreau@example.com",
      phone: "+33 6 12 34 56 78",
      city: "Lyon, France",
      linkedin: "linkedin.com/in/lucas-moreau-dev",
      website: "github.com/lucas-moreau",
      profile: "Étudiant en 2e année de BUT Informatique, motivé et curieux des technologies web modernes (React, TypeScript, CSS). À la recherche d'un stage de 3 mois pour contribuer au développement d'applications réactives.",
      education: "BUT Informatique (Parcours Réalisation d'Applications) — IUT de Lyon — 2024 - Présent\nBaccalauréat Général (Spécialités NSI et Mathématiques, Mention Bien) — 2024",
      skills: "• Langages & Frameworks : HTML5, CSS3, JavaScript ES6+, React, Tailwind CSS\n• Outils & Méthodes : Git, GitHub, VS Code, bases de Node.js et SQL\n• Qualités : Autonomie, curiosité technique, rigueur, esprit d'équipe",
      projects: "Application web de suivi de budget étudiant :\n• Développement d'une interface en React avec graphiques interactifs et stockage local.\n\nRefonte responsive du site d'un club de sport local :\n• Projet tutoré en équipe de 4 : maquettage Figma, intégration CSS accessible et tests multi-écrans.",
      experience: "Tuteur bénévole en programmation — Association Code Pour Tous (6 mois)\n• Animation d'ateliers d'initiation à Python et Scratch auprès d'élèves de collège.\n\nMembre du club robotique universitaire :\n• Assemblage et programmation des capteurs d'un robot suiveur de ligne.",
      languages: "Français : langue maternelle\nAnglais : niveau B2 (lecture fluide de documentation technique)",
      interests: "Veille technologique, impression 3D, échecs (tournois inter-universitaires)."
    }
  },
  {
    id: "commerce",
    title: "Conseillère Vente / Commerce",
    subtitle: "Débutante / Motivation et relationnel",
    category: "Commerce & Vente",
    data: {
      name: "Amina Koné",
      jobTitle: "Conseillère Clientèle & Vente (Débutante motivée)",
      email: "amina.kone@example.com",
      phone: "+225 07 89 45 12 30",
      city: "Abidjan, Côte d'Ivoire",
      linkedin: "",
      website: "",
      profile: "Diplômée d'un BTS Management Commercial Opérationnel, dynamique et dotée d'un excellent sens de l'écoute et du service client. Prête à m'investir pleinement au sein de votre équipe de vente.",
      education: "BTS Management Commercial Opérationnel (MCO) — Lycée Professionnel — 2026\nBaccalauréat Sciences de Gestion — 2024",
      skills: "• Accueil chaleureux et orientation client\n• Maîtrise des techniques d'encaissement et tenue de caisse\n• Organisation et réassort des rayons, merchandising visuel\n• Aisance relationnelle, dynamisme, sens de la négociation",
      projects: "Étude d'attractivité pour un commerce de proximité (Projet d'examen) :\n• Réalisation d'une enquête de satisfaction auprès de 120 clients, analyse des résultats sur Excel et recommandations merchandising adoptées par le commerçant.",
      experience: "Bénévole au stand d'accueil — Salon de l'Artisanat (2 semaines)\n• Renseignement des visiteurs, distribution des livrets de visite et gestion des flux.\n\nOrganisation de la kermesse de fin d'année du lycée :\n• Responsable du stand restauration et de la collecte des fonds caritatifs.",
      languages: "Français : bilingue / courant\nAnglais : niveau scolaire (A2/B1)",
      interests: "Mode éco-responsable, organisation d'événements associatifs, chant choral."
    }
  },
  {
    id: "polyvalent",
    title: "Équipier Polyvalent / Premier Emploi",
    subtitle: "Sans diplôme spécialisé / Volontaire et ponctuel",
    category: "Restauration & Services",
    data: {
      name: "Sarah Diallo",
      jobTitle: "Équipière Polyvalente / Job étudiant",
      email: "sarah.diallo@example.com",
      phone: "+33 7 45 67 89 01",
      city: "Marseille, France",
      linkedin: "",
      website: "",
      profile: "Étudiante assidue, ponctuelle et enthousiaste, disponible pour des horaires flexibles (soirées, week-ends et vacances scolaires). Capacité d'apprentissage rapide et grand sens du collectif.",
      education: "Licence 1 Langues Étrangères Appliquées (LEA) — Université d'Aix-Marseille — En cours\nBaccalauréat Général — 2025",
      skills: "• Rapidité d'exécution et respect scrupuleux des consignes\n• Sens du service et écoute client avec le sourire\n• Respect des normes d'hygiène et de sécurité\n• Endurance physique, gestion du stress en période de forte affluence",
      projects: "Projet solidaire lycéen :\n• Collecte de fournitures scolaires pour des familles défavorisées (plus de 250 kits réunis et distribués).",
      experience: "Garde d'enfants (Babysitting régulier) — 2 familles (1 an)\n• Prise en charge des devoirs, préparation des repas et activités ludiques en toute sécurité.\n\nBénévole lors des journées portes ouvertes universitaires :\n• Guidage des nouveaux bacheliers et présentation des locaux du campus.",
      languages: "Français : langue maternelle\nEspagnol : bon niveau scolaire (B1)\nAnglais : niveau B1",
      interests: "Pratique de l'athlétisme (demi-fond), lecture, cuisine du monde."
    }
  }
];
