# 📊 Modèle de Données et Associations

Ce document explique la logique relationnelle de la base de données du projet "ProjectCryptoJava". Il détaille les liens entre les différentes tables et justifie les choix d'architecture.

Notre architecture s'articule autour d'une table centrale : **User (Utilisateur)**. Toutes les données gravitent autour d'elle via **deux associations principales**, toutes les deux de type **"1 à N" (Un-à-Plusieurs)**.

---

## 1. L'association : User ↔ CryptoKey (Génère / Possède)

Cette association relie un utilisateur à ses clés cryptographiques.

* **La règle de gestion :** Un utilisateur a besoin de clés pour chiffrer ou signer des documents.
* **Le sens "1" (Côté User) :** Une clé cryptographique appartient toujours à **un seul et unique** propriétaire (l'utilisateur). C'est pour cela que la table `CryptoKey` contient la clé étrangère `user_id`.
* **Le sens "0..N" (Côté CryptoKey) :** Un utilisateur peut ne posséder aucune clé au moment de son inscription (0), mais il peut ensuite en générer ou en importer une infinité (N). Par exemple, il peut posséder une paire de clés asymétriques RSA (publique/privée) et plusieurs clés symétriques AES pour différents fichiers.
* **Pourquoi ce choix ?** Cela garantit le cloisonnement strict des données. Quand l'utilisateur "Alice" se connecte, le système utilise son `id` pour requêter la table CryptoKey et ne lui ramène *que* ses propres clés. Bob n'aura jamais accès aux clés d'Alice au niveau de la base de données.

---

## 2. L'association : User ↔ AuditLog (Trace les actions)

Cette association permet de conserver un historique sécurisé de tout ce qui se passe sur la plateforme.

* **La règle de gestion :** Pour des raisons de sécurité et de conformité, nous devons savoir "Qui a fait Quoi, et Quand".
* **Le sens "1" (Côté User) :** Chaque action enregistrée dans le journal d'audit (ex: Chiffrement réussi, Erreur de signature, Connexion) a été déclenchée par **un seul** utilisateur précis. 
* **Le sens "0..N" (Côté AuditLog) :** Un utilisateur fraîchement créé n'a pas encore de traces (0). Mais à force d'utiliser la plateforme, il va générer de multiples lignes d'historique (N). 
* **Pourquoi ce choix ?** L'AuditLog agit comme une "boîte noire" (un journal inaltérable). Relier chaque ligne de log à un `user_id` permet à l'administrateur système de filtrer facilement toutes les actions suspectes ou de retracer chronologiquement tout l'historique d'un utilisateur spécifique en cas de litige.

---

### 💡 En résumé pour une soutenance :
> *"Notre modèle relationnel garantit une stricte isolation des données grâce à la clé étrangère `user_id`. Un utilisateur possède plusieurs clés de chiffrement et génère plusieurs traces d'audit. Si l'on supprime un utilisateur, le modèle relationnel nous permet, par cascade ou logique métier, de nettoyer de manière sécurisée toutes ses clés et d'archiver son historique complet."*
