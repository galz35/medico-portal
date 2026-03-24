import { MailerService } from '@nestjs-modules/mailer';
import { DbService } from '../database/db.service';
export declare class NotificationService {
    private readonly mailerService;
    private readonly db;
    private readonly logger;
    constructor(mailerService: MailerService, db: DbService);
    sendEmail(to: string, subject: string, template: string, context: Record<string, any>, meta?: {
        idUsuario?: number;
        carnet?: string;
        idEntidad?: string;
    }): Promise<void>;
    private registrarNotificacion;
}
