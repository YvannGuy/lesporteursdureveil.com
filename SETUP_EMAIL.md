# Configuration de l'envoi d'emails

## Étape 1 : Créer un compte Resend

1. Allez sur [https://resend.com](https://resend.com)
2. Créez un compte gratuit
3. **Mode test** : Utilisez le domaine de test `onboarding@resend.dev`
4. **Mode production** : Vérifiez votre domaine pour envoyer à tous les utilisateurs

## Étape 2 : Obtenir votre clé API

1. Dans votre dashboard Resend, allez dans "API Keys"
2. Créez une nouvelle clé API
3. Copiez la clé (elle commence par `re_`)

## Étape 3 : Configurer l'environnement

1. Créez un fichier `.env.local` à la racine de votre projet
2. Ajoutez cette ligne :
   ```
   RESEND_API_KEY=re_votre_cle_api_ici
   ```
3. Remplacez `re_votre_cle_api_ici` par votre vraie clé API

## Étape 4 : Redémarrer le serveur

```bash
npm run dev
```

## Test

Une fois configuré, quand quelqu'un entre son email :
- ✅ Vous recevez un email de confirmation (mode test)
- ✅ Vous recevez une notification à `contact@lesporteursdureveil.com`

## ⚠️ Mode Test

En mode test avec Resend :
- Les emails de confirmation sont envoyés à votre adresse `contact@lesporteursdureveil.com`
- Le sujet contient l'email de la personne qui s'est inscrite
- Pour envoyer directement aux utilisateurs, vous devez vérifier votre domaine dans Resend

## Dépannage

Si les emails ne s'envoient pas :
1. Vérifiez que `RESEND_API_KEY` est bien configuré
2. Vérifiez les logs dans la console du serveur
3. Assurez-vous que votre domaine est vérifié dans Resend
