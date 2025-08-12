import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!resend) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Email de confirmation à la personne qui s'inscrit (en mode test, envoyé à votre email)
    const confirmationEmail = await resend.emails.send({
      from: 'Porteur de Réveil <onboarding@resend.dev>',
      to: ['contact@lesporteursdureveil.com'], // En mode test, on envoie à votre email
      subject: `Inscription confirmée - ${email}`,
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

    // Email de notification à l'équipe (en mode test, envoyé à votre email)
    const notificationEmail = await resend.emails.send({
      from: 'Porteur de Réveil <onboarding@resend.dev>',
      to: ['contact@lesporteursdureveil.com'], // En mode test, on envoie à votre email
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
        { error: 'Failed to send confirmation email' },
        { status: 500 }
      );
    }

    if (notificationEmail.error) {
      console.error('Notification email error:', notificationEmail.error);
      return NextResponse.json(
        { error: 'Failed to send notification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      confirmationEmail: confirmationEmail.data,
      notificationEmail: notificationEmail.data 
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
