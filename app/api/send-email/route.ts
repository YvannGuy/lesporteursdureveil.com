import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Vérification de la configuration Resend
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    console.log('API - Email reçu:', email);
    console.log('API - RESEND_API_KEY configuré:', !!resendApiKey);

    if (!email) {
      console.log('API - Email manquant');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log('API - Test regex email:', email, emailRegex.test(email));
    if (!emailRegex.test(email)) {
      console.log('API - Email invalide selon regex:', email);
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    if (!resend) {
      console.error('API - Resend non configuré. Vérifiez RESEND_API_KEY dans .env.local');
      return NextResponse.json(
        { error: 'Service email non configuré. Contactez l\'administrateur.' },
        { status: 500 }
      );
    }

    console.log('API - Tentative d\'envoi des emails...');

    // Email de confirmation à la personne qui s'inscrit
    console.log('API - Envoi email de confirmation à:', email);
    const confirmationEmail = await resend.emails.send({
      from: 'Porteur de Réveil <contact@lesporteursdureveil.com>', // Votre domaine vérifié
      to: [email], // Envoi direct à la personne qui s'inscrit
      subject: `Inscription confirmée - Porteur de Réveil`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #fbbf24; margin: 0;">Porteur de Réveil</h1>
            <p style="color: #666; margin: 10px 0;">Formation et sortie d'évangélisation</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Merci pour votre inscription !</h2>
            <p style="color: #666; line-height: 1.6;">
              Nous avons bien reçu votre demande d'inscription à notre liste d'attente pour la formation 
              <strong>Porteur de Réveil</strong>.
            </p>
            <p style="color: #666; line-height: 1.6;">
              Vous serez parmi les premiers informés dès que les inscriptions seront ouvertes. 
              Nous vous tiendrons au courant de toutes les actualités concernant cette formation 
              exceptionnelle.
            </p>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 14px;">
            <p>Restez connecté pour ne rien manquer !</p>
            <p>L'équipe Porteur de Réveil</p>
          </div>
        </div>
      `,
    });

    // Email de notification à l'équipe
    console.log('API - Envoi email de notification à l\'équipe');
    const notificationEmail = await resend.emails.send({
      from: 'Porteur de Réveil <contact@lesporteursdureveil.com>', // Votre domaine vérifié
      to: ['contact@lesporteursdureveil.com'],
      subject: `Nouvelle inscription - ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #fbbf24; margin: 0;">Porteur de Réveil</h1>
            <p style="color: #666; margin: 10px 0;">Formation et sortie d'évangélisation</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Nouvelle inscription à la liste d'attente</h2>
            <p style="color: #666; line-height: 1.6;">
              Une nouvelle personne s'est inscrite à la liste d'attente pour la formation 
              <strong>Porteur de Réveil</strong>.
            </p>
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="color: #1976d2; margin: 0;"><strong>Email de l'inscrit :</strong></p>
              <p style="color: #333; margin: 5px 0 0 0; font-size: 16px;">${email}</p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Cette personne sera notifiée dès que les inscriptions seront ouvertes.
            </p>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 14px;">
            <p>Notification automatique - Porteur de Réveil</p>
          </div>
        </div>
      `,
    });

    // Vérifier les erreurs pour les deux emails
    if (confirmationEmail.error) {
      console.error('Confirmation email error:', confirmationEmail.error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email de confirmation' },
        { status: 500 }
      );
    }

    if (notificationEmail.error) {
      console.error('Notification email error:', notificationEmail.error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email de notification' },
        { status: 500 }
      );
    }

    console.log('API - Emails envoyés avec succès');
    console.log('API - Confirmation email ID:', confirmationEmail.data?.id);
    console.log('API - Notification email ID:', notificationEmail.data?.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Inscription enregistrée avec succès',
      confirmationEmail: confirmationEmail.data,
      notificationEmail: notificationEmail.data 
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
