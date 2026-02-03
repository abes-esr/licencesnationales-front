export const fr = {
  auth: {
    changePassword: {
      title: "Modifier mon mot de passe",
      submit: "Enregistrer",
      success: "Le mot de passe a été mis à jour",
      meta: {
        title: "Modifier mon mot de passe - Licences Nationales",
        description: "Page de modification du mot de passe de l'application des Licences Nationales"
      }
    },
    login: {
      title: "Connexion",
      sirenLabel: "SIREN",
      sirenPlaceholder: "SIREN",
      passwordLabel: "Mot de passe",
      passwordPlaceholder: "Mot de passe",
      submit: "Se connecter",
      forgotPassword: "Mot de passe oublié ?",
      noAccountTitle: "Votre établissement n'a pas encore de compte ?",
      verifyEligibility: "Vérifier l'éligibilité",
      createAccount: "Créer un compte",
      meta: {
        title: "Connexion - Licences Nationales",
        description: "Page de connexion de l'application des Licences Nationales"
      }
    },
    forgotPassword: {
      title: "Mot de passe oublié",
      subtitle: "Choisir une option de réinitialisation",
      optionSiren: "Je connais le SIREN de mon établissement",
      optionEmail: "Je connais l'adresse e-mail de contact de mon établissement :",
      sirenLabel: "SIREN",
      sirenPlaceholder: "SIREN",
      sirenHelp: "Trouver le SIREN de votre établissement",
      contactEmailLabel: "Adresse e-mail de contact",
      contactEmailPlaceholder: "Adresse e-mail de contact",
      submit: "Envoyer",
      emailNotFound:
        "Si l'adresse e-mail est reconnue, vous recevrez un lien de réinitialisation du mot de passe",
      backHome: "Revenir à la page d'accueil",
      meta: {
        title: "Mot de passe oublié - Licences Nationales",
        description: "Page de demande de réinitialisation du mot de passe"
      }
    },
    passwordForm: {
      rules:
        "Le mot de passe doit contenir au moins 8 caractères, dont au moins un chiffre, une lettre majuscule, une lettre minuscule et un des caractères spéciaux suivants : ",
      expiredMessage:
        "Ce lien n'est plus valide (expiration après 24 heures). Pour réinitialiser votre mot de passe :",
      expiredLink: "cliquez ici.",
      oldPasswordLabel: "Ancien mot de passe",
      oldPasswordPlaceholder: "Ancien mot de passe",
      createPasswordLabel: "Mot de passe",
      createPasswordPlaceholder: "Mot de passe",
      updatePasswordLabel: "Nouveau mot de passe",
      updatePasswordPlaceholder: "Nouveau mot de passe",
      createConfirmLabel: "Confirmation du mot de passe",
      createConfirmPlaceholder: "Confirmation du mot de passe",
      updateConfirmLabel: "Confirmation du nouveau mot de passe",
      updateConfirmPlaceholder: "Confirmation du nouveau mot de passe",
      confirmMismatch: "La confirmation du mot de passe ne correspond pas au mot de passe saisi"
    },
    resetPassword: {
      title: "Réinitialiser le mot de passe",
      cancel: "Annuler",
      save: "Enregistrer",
      backHome: "Revenir à la page d'accueil",
      invalidFields: "Des champs ne remplissent pas les conditions",
      meta: {
        title: "Réinitialiser le mot de passe - Licences Nationales",
        description: "Page de réinitialisation du mot de passe"
      }
    }
  },
  common: {
    confirm: {
      cancel: "Annuler",
      confirm: "Confirmer"
    },
    header: {
      appLabel: "Accueil Licences nationales",
      logoAlt: "Logo licences nationales",
      illustrationAlt: "Illustration licences nationales",
      darkTheme: "Thème sombre",
      welcome: "Bienvenue {name}",
      changePassword: "Modifier le mot de passe",
      editInfo: "Modifier les infos",
      support: "Assistance",
      documentation: "Documentation",
      logout: "Se déconnecter"
    },
    footer: {
      quickAccess: "Accès direct",
      assistance: "Assistance",
      site: "Site Licences nationales",
      documentation: "Documentation",
      licencesNationales: "Licences Nationales ",
      agencyName: "Agence bibliographique de l'enseignement supérieur",
      addressLine1: "227 av. Jean-Louis Viala CS 84308",
      addressLine2: "34193 Montpellier Cedex 5",
      phone: "Tél. : +33 (0)4 67 54 84 10",
      abesLogoAlt: "Logo ABES",
      mesriLogoAlt: "Logo MESRI",
      front: "Front",
      back: "Back",
      versionError: "Impossible de récupérer le numéro de version : {error}",
      personalData: "Données personnelles",
      terms: "CGU",
      legal: "Mentions légales",
      accessibility: "Accessibilité"
    },
    sideMenu: {
      dashboard: "Tableau de bord",
      institutions: "Liste des établissements",
      publishers: "Liste des éditeurs",
      statistics: "Statistiques de l'application",
      history: "Historique des actions",
      search: "Recherche",
      ip: "Adresse IP"
    },
    search: {
      title: "Rechercher dans toute la base",
      domainPlaceholder: "Domaine de recherche",
      keywordsLabel: "Mots clés",
      keywordsPlaceholder: "Mots clés",
      submit: "Rechercher",
      resultsTitle: 'Résultats pour "{query}" dans {domain} :',
      domainRequired: "Le domaine de recherche est obligatoire",
      searchError: "Erreur lors de la recherche",
      navigationError: "Erreur lors de la navigation",
      domains: {
        institutions: "Établissements",
        ips: "Adresses IP",
        publishers: "Éditeurs"
      },
      meta: {
        title: "Recherche - Licences Nationales",
        description: "Page de recherche globale"
      }
    }
  },
  dashboard: {
    title: "Tableau de bord",
    accountInfo: "Informations du compte",
    exportAccountInfo: "Exporter les infos du compte",
    accountCreatedOn: "Compte créé le :",
    institution: {
      title: "Établissement",
      readonly: "Non modifiable par l'utilisateur",
      siren: "Siren :",
      idAbes: "ID ABES :",
      name: "Nom :",
      type: "Type :",
      contactSupport:
        "Pour toute demande de modification des infos de l'établissement, nous contacter via le guichet d'assistance"
    },
    contact: {
      title: "Contact",
      lastName: "Nom :",
      firstName: "Prénom :",
      phone: "Tél. :",
      email: "E-mail :",
      address: "Adresse :",
      poBox: "BP :",
      postalCode: "Code postal :",
      city: "Ville :",
      cedex: "Cedex :",
      editContact: "Modifier le contact",
      editPassword: "Modifier le mot de passe"
    },
    notifications: {
      adminTitle: "Dernières actions des utilisateurs",
      userTitle: "Actions à faire",
      siren: "Siren :",
      institutionName: "Nom de l'établissement :",
      event: "Événement :",
      date: "Date :"
    },
    publishers: {
      title: "Envoi aux éditeurs",
      send: "Envoi aux éditeurs",
      sentOn: "Envoyé le",
      sentAgo: "-",
      confirm:
        "Vous êtes sur le point de lancer le traitement d'envoi aux éditeurs.\\n\\nÊtes-vous sûr de vouloir continuer ?"
    },
    meta: {
      description: "Tableau de bord utilisateur de l'application des Licences Nationales",
      keywords: "tableau de bord licences nationales",
      title: "Tableau de bord - Licences Nationales"
    }
  },
  publisher: {
    form: {
      createTitle: "Créer un éditeur",
      editTitle: "Modifier un éditeur",
      sectionTitle: "Informations de l'éditeur",
      nameLabel: "Nom de l'éditeur",
      namePlaceholder: "Nom de l'éditeur",
      identifierLabel: "Identifiant éditeur",
      identifierPlaceholder: "Identifiant éditeur",
      relatedInstitutionsLabel: "Groupes d'établissements reliés",
      relatedInstitutionsPlaceholder: "Groupes d'établissements reliés",
      selectAll: "Tout sélectionner",
      addressLabel: "Adresse postale",
      addressPlaceholder: "Adresse postale",
      contactSectionTitle: "Informations de contact",
      contactsCount: "{count} contact(s)",
      addContact: "Ajouter un contact",
      cancel: "Annuler",
      save: "Enregistrer",
      contactTypeError: "Vous devez saisir au moins un contact technique et un contact commercial",
      invalidFields: "Des champs ne remplissent pas les conditions",
      invalidFieldsWithReason: "Des champs ne remplissent pas les conditions : {reason}",
      createSuccess: "L'éditeur a bien été créé",
      updateSuccess: "L'éditeur a bien été modifié",
      meta: {
        createTitle: "Créer un éditeur - Licences Nationales",
        editTitle: "Modifier un éditeur - Licences Nationales",
        description: "Gestion des éditeurs"
      }
    },
    list: {
      title: "Gestion des éditeurs",
      create: "Créer un éditeur",
      all: "Tous",
      downloadTooltip: "Le téléchargement correspond à la vue filtrée",
      downloadTitle: "Télécharger la liste des éditeurs",
      searchLabel: "Chercher dans les colonnes",
      createdAt: "Date de création du compte éditeur",
      name: "Nom de l'éditeur",
      action: "Action",
      notAllowed: "Vous n'êtes pas autorisé à exécuter l'action ListeEditeur",
      unauthorized: "Vous n'êtes pas autorisé à effectuer cette opération",
      deleteConfirm: String.raw`Vous êtes sur le point de supprimer le compte de l'éditeur {name}\n\nÊtes-vous sûr de vouloir continuer ?`,
      deleteSuccess: "L'éditeur {name} a bien été supprimé",
      meta: {
        title: "Liste des éditeurs - Licences Nationales",
        description: "Gestion de la liste des éditeurs"
      }
    }
  },
  institution: {
    card: {
      title: "Établissement {name}",
      accountInfo: "Informations du compte",
      exportAccountInfo: "Exporter les infos du compte",
      viewIpList: "Voir la liste des adresses IP",
      accountCreatedOn: "Compte créé le :",
      editAccount: "Modifier le compte",
      validateChanges: "Enregistrer les modifications du compte",
      resetFields: "Réinitialiser les champs d'origine",
      validateAccount: "Valider le compte",
      invalidateAccount: "Dévalider le compte",
      institutionSection: "Établissement",
      readonly: "Non modifiable par l'utilisateur",
      siren: "Siren",
      institutionName: "Nom de l'établissement",
      idAbes: "ID ABES",
      institutionType: "Type d'établissement",
      institutionStatus: "Statut de l'établissement :",
      ipStatus: "Statut adresse IP :",
      contactSection: "Contact",
      contactLastName: "Nom du contact",
      contactFirstName: "Prénom du contact",
      contactPhone: "Téléphone du contact",
      contactEmail: "E-mail du contact",
      contactAddress: "Adresse du contact",
      contactPoBox: "BP du contact",
      contactPostalCode: "Code postal du contact",
      contactCity: "Ville du contact",
      contactCedex: "Cedex du contact",
      deleteAccount: "Supprimer le compte",
      unauthorized: "Vous n'êtes pas autorisé à exécuter l'action AfficherEtablissement",
      confirmDelete:
        "ATTENTION : Vous êtes sur le point de supprimer définitivement le compte de l'établissement {name} avec toutes les informations associées (les adresses IP,...).\\n\\nÊtes-vous sûr de vouloir effectuer cette action ?",
      deleteSuccess: "Le compte a bien été supprimé",
      confirmValidate:
        "Vous êtes sur le point de valider le compte de l'établissement {name}\\n\\nÊtes-vous sûr de vouloir effectuer cette action ?",
      confirmInvalidate:
        "Vous êtes sur le point de dévalider le compte de l'établissement {name}\\n\\nÊtes-vous sûr de vouloir effectuer cette action ?",
      meta: {
        title: "Fiche établissement - Licences Nationales",
        description: "Détail d'un établissement"
      }
    },
    contactForm: {
      lastName: "Nom",
      firstName: "Prénom",
      address: "Adresse",
      poBox: "Boîte postale",
      postalCode: "Code postal",
      city: "Ville",
      cedex: "CEDEX",
      phone: "Téléphone",
      emailNotice:
        "Choisir de préférence un alias pérenne pour continuer de recevoir les différents messages informatifs sur la gestion du compte et des adresses IP déclarées en cas de changement d'interlocuteur ou d'interlocutrice au sein de l'établissement",
      email: "E-mail de contact",
      confirmEmail: "Confirmez votre adresse e-mail",
      confirmEmailError: "L'adresse e-mail de confirmation n'est pas valide",
      privacyConsent: "J'accepte les conditions générales liées à la politique de confidentialité*",
      privacyNotice:
        "Pour connaître et exercer vos droits relatifs à l'utilisation des données collectées par ce formulaire, veuillez consulter la page",
      privacyLink: "Données personnelles",
      recaptchaIntro: "Ce formulaire est protégé par reCAPTCHA, la",
      recaptchaPrivacy: "politique de confidentialité",
      recaptchaAnd: "ainsi que les",
      recaptchaTerms: "conditions d'utilisation",
      recaptchaApply: "de Google s'appliquent."
    },
    list: {
      title: "Gestion des comptes établissements",
      split: "Scission",
      merge: "Fusion",
      create: "Créer un établissement",
      all: "Tous",
      downloadTooltip: "Le téléchargement correspond à la vue filtrée",
      downloadTitle: "Télécharger la liste des établissements",
      searchLabel: "Chercher dans les colonnes",
      unauthorized: "Vous n'êtes pas autorisé à exécuter l'action AfficherEtablissements",
      unauthorizedOperation: "Vous n'êtes pas autorisé à effectuer cette opération",
      headers: {
        createdAt: "Date de création",
        idAbes: "Identifiant ABES",
        siren: "SIREN",
        name: "Nom de l'établissement",
        type: "Type d'établissement",
        ipLastUpdate: "Dernière date de modification des adresses IP",
        status: "Statut",
        ipList: "Liste des adresses IP"
      },
      status: {
        all: "Tous",
        noIp: "Sans adresse IP",
        reviewIp: "Examiner adresse IP",
        attestation: "Attestation à envoyer",
        ipOk: "Adresse IP OK"
      },
      meta: {
        title: "Liste des établissements - Licences Nationales",
        description: "Gestion des comptes établissements"
      }
    },
    form: {
      createTitle: "Créer le compte de votre établissement",
      hasAccount: "Votre établissement a déjà un compte ?",
      authenticate: "S'authentifier",
      backHome: "Revenir à la page d'accueil",
      eligibilityTitle:
        "Avant de créer votre compte, vérifier l'éligibilité de votre établissement",
      attention: "Attention : ",
      eligibilityText:
        "L'accès aux corpus sous licences nationales est réservé aux établissements bénéficiaires selon les conditions spécifiques négociées avec chaque éditeur. Pour permettre la déclaration des adresses IP autorisées, l'Abes met à la disposition des professionnels de la documentation cette application dédiée à la gestion des accès. ",
      eligibilityLink: "Vérifier l'éligibilité de votre établissement.",
      eligibilityConfirm: "Je confirme que mon établissement est éligible",
      institutionSection: "Informations de l'établissement",
      institutionName: "Nom de l'établissement",
      siren: "SIREN",
      sirenStatus: "SIREN : {status}",
      idAbes: "ID ABES",
      institutionType: "Type d'établissement",
      findSiren: "Trouver le SIREN de votre établissement",
      contactSection: "Informations de contact",
      cancel: "Annuler",
      save: "Enregistrer",
      sirenPending: "En attente de vérification",
      sirenChecking: "Vérification du SIREN en cours...",
      sirenUnknown: "Inconnu",
      sirenServiceError: "Impossible de contacter le service de vérification du numéro SIREN",
      sirenInternalError: "Erreur interne : {message}",
      unknownSiren: "Le SIREN de l'établissement est inconnu",
      invalidFields: "Certains champs du formulaire sont invalides",
      createSuccess: "Le compte a été enregistré. Pour y accéder, merci de vous authentifier",
      updateSuccess: "Votre compte a bien été modifié.",
      mergeSuccess: "La mergeInstitutions a bien été effectuée.",
      meta: {
        createTitle: "Inscription - Licences Nationales",
        editTitle: "Modification du compte - Licences Nationales",
        description: "Création ou modification de compte sur l'application des Licences Nationales"
      }
    },
    history: {
      title: "Historique par établissement",
      institutionLabel: "Établissement",
      institutionPlaceholder: "Sélectionner un établissement",
      tabs: {
        institutions: "Établissements",
        ips: "Adresses IP"
      },
      table: {
        date: "Date",
        action: "Action",
        information: "Informations"
      },
      meta: {
        title: "Historique - Licences Nationales",
        description: "Historique des actions par établissement"
      }
    },
    stats: {
      title: "Statistiques de l'application",
      periodTitle: "Saisissez la période souhaitée pour les statistiques",
      startDate: "Date de début",
      endDate: "Date de fin",
      cancel: "Annuler",
      validate: "Valider",
      resultsTitle: "Statistiques entre le {start} et le {end}",
      institutions: "Établissements",
      ips: "Adresses et plages IP",
      meta: {
        title: "Statistiques - Licences Nationales",
        description: "Statistiques de l'application"
      }
    },
    merge: {
      title: "Fusion d'établissements",
      sirenTitle: "Siren des établissements à fusionner",
      sirenLabel: "SIREN",
      addSiren: "Ajouter un siren",
      removeSiren: "Supprimer un siren",
      meta: {
        title: "Fusion d'établissements - Licences Nationales",
        description: "Fusion de comptes établissements"
      }
    },
    split: {
      title: "Scission d'établissements",
      sirenTitle: "Siren de l'établissement à scinder",
      sirenLabel: "SIREN",
      count: "Nombre d'établissements : {count}",
      addInstitution: "Ajouter un établissement",
      removeInstitution: "Supprimer un établissement",
      save: "Enregistrer",
      success: "La splitInstitution a bien été effectuée.",
      meta: {
        title: "Scission d'établissements - Licences Nationales",
        description: "Scission de comptes établissements"
      }
    }
  },
  ip: {
    create: {
      title: "Déclarer de nouvelles adresses ou plages IP",
      backToList: "Revenir à la liste complète des adresses IP",
      chooseType: "Choisir le type d'adresse IP à déclarer",
      helpLink: "Consulter l'aide pour la déclaration des adresses IP",
      addedListTitle: "Nouvelles adresses IP ou plages IP ajoutées",
      delete: "Supprimer",
      deleteConfirm:
        "Vous êtes sur le point de supprimer définitivement une adresse IP ou une plage d'adresses IP.\\n\\nÊtes-vous sûr de vouloir effectuer cette action ?",
      table: {
        type: "Type",
        address: "Adresse"
      },
      meta: {
        description: "Page de déclaration d'adresse IP de l'application des Licences Nationales",
        title: "Ajout d'adresse IP - Licences Nationales"
      }
    },
    info: {
      openingDelays: "En savoir plus sur les délais d'ouverture des accès",
      statuses: "Les différents statuts des adresses IP",
      attestationWhy: "Pourquoi une attestation est parfois demandée ?",
      attestationTemplate: "Télécharger un modèle d'attestation"
    },
    segments: {
      single: "Adresse IP",
      range: "Plage d'adresses IP",
      pasteHint:
        "Possibilité de copier/coller directement les adresses IP dans les champs de saisie",
      startIp: "Adresse IP de début",
      endIp: "Adresse IP de fin",
      clearFields: "Vider les champs",
      commentsLabel: "Commentaires",
      commentsHint:
        "Apporter ici toute précision sur l'attribution de cette adresse IP, surtout si elle n'appartient pas au réseau Renater.",
      save: "Enregistrer",
      saveError: "Erreur lors de l'enregistrement"
    },
    list: {
      title: "Liste des adresses IP déclarées par {name}",
      backToInstitution: "Revenir aux informations de l'établissement",
      addIp: "Ajouter une adresse IP ou une plage IP",
      all: "Tous",
      noData: "Aucune adresse IP déclarée pour l'instant. Déclarez une adresse ou une plage IP.",
      downloadTooltip: "Le téléchargement correspond à la vue filtrée",
      downloadTitle: "Télécharger la liste des adresses IP",
      searchLabel: "Chercher dans les colonnes",
      review: "Examiner",
      delete: "Supprimer",
      cancel: "Annuler",
      reject: "Rejeter",
      validate: "Valider",
      saveActions: "Enregistrer mes actions",
      actionsDone: "Actions effectuées",
      deleteConfirm:
        "Vous êtes sur le point de supprimer définitivement l'adresse IP ou plage d'adresses IP {ip}\\n\\nÊtes-vous sûr de vouloir effectuer cette action ?",
      deleteSuccess: "Adresse IP supprimée.",
      whoisError: "Impossible d'exécuter le Whois",
      headers: {
        createdAt: "Date de saisie",
        type: "Type d'adresse IP",
        value: "Valeur",
        status: "Statut",
        action: "Action",
        lastAction: "Dernière action de l'Abes",
        precision: "Précision sur l'adresse IP",
        review: "Examiner",
        delete: "Supprimer"
      },
      status: {
        attestationPending: "En attente d'attestation",
        validatedByAbes: "Adresse IP validée par l'Abes",
        reviewPending: "En attente d'examen par l'Abes"
      },
      types: {
        ipv4: "IPV4",
        ipv6: "IPV6",
        rangeIpv4: "Plage IPV4",
        rangeIpv6: "Plage IPV6",
        rangePrefix: "Plage "
      },
      info: {
        waiting: "Adresse IP transmise aux éditeurs et à l'Inist si validée par l'Abes",
        attestation:
          "Adresse IP transmise aux éditeurs et à l'Inist après réception de l'attestation",
        valid: "Adresse IP transmise aux éditeurs et à l'Inist à chaque fin de mois"
      },
      meta: {
        title: "Liste des adresses IP - Licences Nationales",
        description: "Gestion des adresses IP"
      },
      dialog: {
        title: "Analyse de l'adresse IP",
        comment: "Commentaire",
        noComment: "Aucun commentaire",
        whois: "Whois",
        rangeStart: "de début ",
        renater: "fait partie du réseau RENATER",
        renaterNot: "ne fait pas partie du réseau RENATER",
        whoisStartIn: "L'adresse ",
        whoisStartNot: "L'adresse ",
        whoisEndIn: "L'adresse de fin fait partie du réseau RENATER",
        whoisEndNot: "L'adresse de fin ne fait pas partie du réseau RENATER",
        adminComment: "Commentaire admin",
        deleteReason: "Raisons de la suppression"
      }
    }
  },
  footer: {
    accessibility: {
      title: "Accessibilité numérique",
      introTitle:
        "Mise en conformité au Référentiel Général d'Accessibilité pour les Administrations (RGAA)",
      introP1:
        "Conformément à l'article 47 de la loi Handicap (n° 2005-102 du 11 février 2005) et à son décret d'application actualisé en 2019, l'Agence bibliographique de l'enseignement supérieur (Abes) s'engage à la mise en conformité au Référentiel Général d'Accessibilité pour les Administrations (RGAA) afin d'optimiser l'accessibilité de ses interfaces numériques, ce qui concerne environ une trentaine de sites et applications.",
      introP2:
        "À cette fin, l'Abes a défini son schéma pluriannuel 2022-2024. Par ailleurs, le plan annuel d'accessibilité 2022 détaille les opérations programmées pour l'année. Des mises à jour seront apportées au fur et à mesure des réalisations effectuées.",
      planMulti:
        "Consulter le schéma pluriannuel de mise en accessibilité 2022 - 2024 (pdf - 1 Mo)",
      planAnnual: "Consulter le Plan annuel d'accessibilité 2022 (pdf - 1 Mo)",
      siteTitle: "Accessibilité du site acces.licencesnationales.fr : partiellement conforme",
      declarationTitle:
        "Déclaration d'accessibilité au Référentiel Général d'Accessibilité pour les Administrations (RGAA)",
      declarationP1:
        "Cette déclaration d'accessibilité s'applique au site acces.licencesnationales.fr",
      declarationP2: "et a été effectuée en 2022.",
      complianceTitle: "État de conformité",
      complianceP1: "Le site acces.licencesnationales.fr",
      complianceP2:
        "est en conformité partielle avec le Référentiel Général d'Accessibilité pour les Administrations -",
      complianceLink: "RGAA version 4",
      complianceP3:
        ', en raison de non-conformités énumérées dans la section "Contenus non accessibles". Le site est en grande partie utilisable, mais comporte certains problèmes d\'accessibilité qui peuvent impacter la navigation des personnes aveugles et des personnes qui naviguent au clavier.',
      nonAccessibleTitle: "Contenus non accessibles",
      nonAccessibleItems: {
        imageDecor: "certaines images de décoration n'ont pas d'alternative renseignée",
        imageInfo: "certaines images porteuses d'information ne sont pas décrites",
        contrast: "plusieurs contrastes de couleurs sont insuffisants",
        scripts:
          "certains scripts doivent être corrigés pour être accessibles au lecteur d'écran et à la navigation au clavier",
        color: "certaines informations sont véhiculées uniquement par la couleur ou par la forme",
        linkTitles: "certains titres de liens sont redondants",
        formLabels: "les champs de formulaire ne disposent pas toujours d'une étiquette pertinente"
      },
      siteFeaturesTitle: "Caractéristiques du site acces.licencesnationales.fr",
      techTitle: "Technologies utilisées",
      tech: {
        vue: "Framework VueJS et Vuetify",
        html: "HTML5",
        css: "CSS",
        js: "JavaScript"
      },
      evaluationTitle: "Démarche d'évaluation de l'accessibilité",
      toolsTitle: "Outils utilisés",
      tools: {
        checker: "Accessibility checker",
        contrast: "Contrast checker",
        lighthouse: "Lighthouse (Google Chrome)",
        wave: "Wave (Web Accessibility Evaluation Tool)",
        inspector: "Inspecteur de code"
      },
      testEnvTitle: "Environnement de test",
      testEnv: {
        browsers: "Navigateurs Firefox et Google Chrome"
      },
      assistanceTitle: "Assistance et demande de recours",
      assistanceP1: "En vertu de l'article 11 de la loi de février 2005 :",
      assistanceP2:
        "La personne handicapée a droit à la compensation des conséquences de son handicap, quels que soient l'origine et la nature de sa déficience, son âge ou son mode de vie.",
      assistanceP3:
        "Pour permettre aux usagers d'être orientés vers une alternative accessible ou d'obtenir le contenu sous une autre forme, l'Abes met à disposition son guichet d'assistance :",
      assistanceLink: "Guichet AbesSTP",
      assistanceDomain: '/ domaine "Accessibilité numérique"',
      recoursP1:
        "Si une personne signalait un problème d'accessibilité et n'obtenait pas de réponse de la part de l'Abes, elle est en droit de faire parvenir ses doléances ou demande de saisine au Défenseur des Droits :",
      recoursP2: "contacter le Défenseur des droits :",
      recoursLink: "formulaire en ligne",
      recoursDelegue: "saisir le délégué du Défenseur des droits dans votre région.",
      recoursMail:
        "envoyer un courrier postal (sans affranchissement) : Le Défenseur des Droits - Libre réponse 71120 - 75342 PARIS Cedex 07",
      meta: {
        title: "Accessibilité - Licences Nationales",
        description: "Déclaration d'accessibilité"
      }
    },
    legal: {
      title: "Mentions légales",
      responsibilityTitle: "Responsabilités",
      publisherTitle: "Éditeur",
      publisherLine1: "Agence Bibliographique de l'Enseignement Supérieur (Abes)",
      publisherLine2: "227 avenue Professeur Jean-Louis Viala - CS 84308 34193 MONTPELLIER CEDEX 5",
      publisherLine3: "04.67.54.84.10",
      publisherLine4: "Établissement public à caractère administratif - Siret : 180 044 224 000 20",
      directorTitle: "Directeur de publication",
      directorText: "David Aymonin, directeur de l'Abes",
      creditsTitle: "Crédits",
      creditsText1:
        "L'application de gestion des adresses IP a été conçue et développée par l'ABES.",
      creditsText2: "Le graphisme a été réalisé par le service UX design de l'Abes.",
      presentationTitle: "Présentation du site",
      presentationText:
        "Cette application gère les accès aux ressources acquises en licence nationale, via les plateformes des éditeurs et/ou via les plateformes d'archivage de l'Inist-CNRS (ISTEX, PANIST).",
      contactTitle: "Contact",
      contactText1:
        "Pour toute demande d'information ou pour signaler tout contenu erroné ou illicite présent sur le site, merci de :",
      contactText2: "contacter le standard de l'Abes : +33 4 67 54 84 10",
      contactText3: "déposer une demande sur le",
      contactLink: "guichet ABESstp",
      ipTitle: "Propriété intellectuelle",
      ipText1:
        "La structuration du site mais aussi les textes, graphiques, images, photographies, sons, vidéos et applications informatiques qui le composent sont la propriété de l'éditeur et sont protégés comme tels par les lois en vigueur au titre de la propriété intellectuelle.",
      ipText2:
        "Toute représentation, reproduction, adaptation ou exploitation partielle ou totale des contenus, marques déposées et services proposés par le site, par quelque procédé que ce soit, sans l'autorisation préalable, expresse et écrite de l'éditeur, est strictement interdite et serait susceptible de constituer une contrefaçon au sens des articles L. 335-2 et suivants du Code de la propriété intellectuelle. Et ce, à l'exception des éléments expressément désignés comme libres de droits sur le site. L'accès au site ne vaut pas reconnaissance d'un droit et, de manière générale, ne confère aucun droit de propriété intellectuelle relatif à un élément du site, lesquels restent la propriété exclusive de l'éditeur.",
      meta: {
        title: "Mentions légales - Licences Nationales",
        description: "Informations légales"
      }
    },
    privacy: {
      title: "Données personnelles",
      p1: "L'Abes s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site Licences nationales (licencesnationales.fr) soient conformes au Règlement Général européen sur la Protection des Données (RGPD).",
      p2: "Aucune information personnelle n'est donc collectée à votre insu.",
      p3: "Les informations recueillies dans le formulaire d'inscription sont enregistrées dans un fichier informatisé par l'Agence Bibliographique de l'Enseignement Supérieur (Abes) pour la gestion des accès aux ressources acquises en licence nationale, via les plateformes des éditeurs et/ou via les plateformes d'archivage de l'Inist-CNRS (ISTEX, PANIST). Elles sont conservées pendant la durée d'exercice de l'activité de l'agent concerné, et sont destinées aux personnes en charge des accès des établissements bénéficiaires aux ressources citées (éditeurs, équipes de l'Abes, de l'Inist-CNRS et du consortium Couperin.org).",
      p4: 'Conformément au Règlement général sur la protection des données et à la loi "informatique et libertés", vous pouvez exercer votre droit d\'accès aux données vous concernant et les rectifier.',
      p5: "Pour toute question,",
      contactLink: "contacter le guichet d'assistance ABESstp",
      cookiesTitle: "À propos des cookies",
      cookiesIntro:
        "Différents cookies sont utilisés sur le site, afin d'améliorer son interactivité et la qualité de ses services. Types de cookies déposés sur ce site :",
      cookiesInternalTitle: "1) Cookies internes nécessaires au fonctionnement du site",
      cookiesInternalText:
        "Ces cookies permettent au site de fonctionner de manière optimale. Vous pouvez vous y opposer et les supprimer en utilisant les paramètres de votre navigateur, cependant votre expérience utilisateur risque d'être dégradée.",
      cookiesTable: {
        name: "Nom du cookie",
        purpose: "Finalité",
        duration: "Durée de conservation"
      },
      cookieAcceptPurpose: "Acceptation de l'utilisation de cookies",
      cookieAcceptDuration: "13 mois",
      cookieRecaptchaName: "Cookies Google reCAPTCHA",
      cookieRecaptchaPurpose:
        "Ce cookie est utilisé dans le formulaire de création de comptes, afin d'empêcher ou de décourager le spam. L'utilisation de cette technologie implique l'installation du cookie (non de profilage) de la société Google.",
      cookieRecaptchaDuration: "7 jours",
      cookiesAnalyticsTitle: "2) Cookies de mesure d'audience",
      cookiesAnalyticsText1:
        "En vue d'adapter le site aux demandes de ses visiteurs, nous mesurons le nombre de visites, le nombre de pages vues ainsi que l'activité des visiteurs sur le site et leur fréquence de retour.",
      cookiesAnalyticsText2:
        "PIWIK, l'outil de statistiques utilisé par l'ABES, génère les cookies suivants :",
      cookiePiwikPurpose: "Statistiques Piwik",
      cookiePiwikDurationShort: "7 jours",
      cookiePiwikDurationLong: "30 minutes",
      ipNote:
        "Nous collectons également votre adresse IP, anonymisée, afin de déterminer la ville depuis laquelle vous vous connectez. L'application Licences Nationales ne peut donc en aucun cas remonter par ce biais à une personne physique.",
      dataRetention:
        "Les données personnelles recueillies (identifiant du cookie) sont conservées par l'ABES pour une durée de 13 mois. Elles ne sont ni cédées à des tiers, ni utilisées à d'autres fins.",
      meta: {
        title: "Données personnelles - Licences Nationales",
        description: "Politique de confidentialité et cookies"
      }
    },
    terms: {
      title: "Conditions générales d'utilisation",
      section1Title: "1. Acceptation des conditions d'utilisation",
      section1P1: "L'accès et l'utilisation du site Licences nationales",
      section1P2:
        "sont soumis à l'acceptation et au respect des présentes Conditions Générales d'Utilisation (CGU). À tout moment et sans préavis, l'éditeur se réserve le droit de modifier le site et ses services ainsi que les présentes CGU, notamment afin de s'adapter aux évolutions du site, comme la mise à disposition de nouvelles fonctionnalités ou la suppression / modification de fonctionnalités existantes.",
      section1P3:
        "Il est donc conseillé à l'utilisateur de se référer avant toute navigation à la dernière version des CGU, accessible à tout moment sur le site. En cas de désaccord avec les CGU, aucun usage du site ne saurait être effectué par l'utilisateur.",
      section2Title: "2. Gestion du site, accès et navigation",
      section2P1:
        "L'éditeur met en œuvre les solutions techniques à sa disposition pour permettre l'accès au site 24 heures sur 24, 7 jours sur 7. Il pourra néanmoins à tout moment suspendre, limiter une catégorie déterminée d'internautes ou interrompre l'accès au site ou à certaines pages de celui-ci afin de procéder à des mises à jour, des modifications de son contenu ou toute autre action jugée nécessaire au bon fonctionnement du site. Il pourra également supprimer toute information pouvant en perturber le fonctionnement ou entrant en contravention avec les lois nationales ou internationales, ou avec les règles de la Nétiquette",
      section2P2: "La connexion et la navigation sur le site Licences nationales",
      section2P3:
        "valent acceptation sans réserve des présentes Conditions Générales d'Utilisation, quels que soient les moyens techniques d'accès et les terminaux utilisés.",
      section3Title: "3. Responsabilités",
      section3P1:
        "L'éditeur n'est responsable que du contenu qu'il a lui-même édité. L'éditeur n'est pas responsable : en cas de problèmes ou défaillances techniques, informatiques ou de compatibilité du site avec un matériel ou logiciel quel qu'il soit ; des dommages directs ou indirects, matériels ou immatériels, prévisibles ou imprévisibles résultant de l'utilisation ou des difficultés d'utilisation du site ou de ses services ; des caractéristiques intrinsèques de l'Internet, notamment celles relatives au manque de fiabilité et au défaut de sécurisation des informations y circulant ; des contenus ou activités illicites utilisant son site et ce, sans qu'il en ait dûment connaissance au sens de la Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique et du Règlement Général européen sur la Protection des Données (RGPD) relatif à la protection des personnes physiques à l'égard du traitement de données à caractère personnel. Par ailleurs, l'éditeur ne saurait garantir l'exactitude, la complétude, et l'actualité des informations qui y sont diffusées.",
      section4Title: "4. Liens hypertextes",
      section4P1: "Le site Licences nationales",
      section4P2:
        "peut contenir des liens hypertextes pointant vers d'autres sites internet sur lesquels l'éditeur n'exerce pas de contrôle. Malgré les vérifications préalables et régulières réalisées par l'éditeur, celui-ci décline toute responsabilité quant aux contenus qu'il est possible de trouver sur ces sites. L'éditeur autorise la mise en place de liens hypertextes vers toute page ou document de son site. Sont cependant exclus de cette autorisation les sites diffusant des informations à caractère illicite, violent, polémique, pornographique, xénophobe ou pouvant porter atteinte à la sensibilité du plus grand nombre. Plus généralement, l'éditeur se réserve le droit de faire supprimer à tout moment un lien hypertexte pointant vers son site, si le site en question est estimé non conforme à sa politique éditoriale.",
      section5Title: "5. Loi applicable et juridiction compétente",
      section5P1:
        "Les présentes Conditions Générales d'Utilisation sont régies par la loi française. En cas de différend et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.",
      meta: {
        title: "Conditions d'utilisation - Licences Nationales",
        description: "Conditions générales d'utilisation"
      }
    }
  },
  validation: {
    establishmentNameRules: {
      required: "Le nom de l'établissement est obligatoire"
    },
    sirenRules: {
      required: "SIREN obligatoire",
      format: "Le SIREN doit comporter 9 chiffres"
    },
    establishmentTypeRules: {
      required: "Le type de l'établissement est obligatoire"
    },
    lastNameRules: {
      required: "Le nom est obligatoire"
    },
    firstNameRules: {
      required: "Le prénom est obligatoire"
    },
    addressRules: {
      required: "L'adresse postale est obligatoire"
    },
    postalCodeRules: {
      required: "Le code postal est obligatoire",
      format: "Le code postal doit comporter 5 chiffres"
    },
    cityRules: {
      required: "La ville de l'établissement est obligatoire"
    },
    phoneRules: {
      required: "Le téléphone du contact est obligatoire",
      format: "Le numéro de téléphone doit comporter 10 chiffres sans espace et sans point"
    },
    emailRules: {
      required: "Champ obligatoire",
      invalid: "Adresse mail invalide"
    },
    passwordRules: {
      required: "Le mot de passe est obligatoire",
      minLength: "Le mot de passe doit contenir au moins 8 caractères",
      lowercase: "Le mot de passe doit contenir au moins une minuscule",
      uppercase: "Le mot de passe doit contenir au moins une majuscule",
      digit: "Le mot de passe doit contenir au moins un chiffre",
      special: "Le mot de passe doit contenir au moins un caractère spécial parmi "
    },
    privacyAcceptanceRules: {
      required:
        "L'acceptation des conditions générales liées à la politique de confidentialité est obligatoire pour créer un compte"
    },
    searchDomainRules: {
      required: "Le domaine de recherche est obligatoire"
    },
    searchQueryRules: {
      required: "Veuillez saisir un ou des critères de recherche"
    },
    dateRules: {
      required: "Les dates sont obligatoires"
    },
    ipSegmentRules: {
      required: "Le segment d'IP est obligatoire",
      invalid: "Le segment d'IP fourni n'est pas valide"
    },
    ipRules: {
      required: "L'IP est obligatoire",
      invalid: "L'IP fournie n'est pas valide"
    },
    ipRangeRules: {
      required: "La plage d'Ips est obligatoire",
      invalid: "La plage d'Ips fournie n'est pas valide"
    },
    commentRules: {
      max255: "Le commentaire ne doit pas excéder 255 caractères"
    },
    adminCommentRules: {
      max4000: "Le commentaire ne doit pas excéder 4000 caractères"
    }
  }
};
