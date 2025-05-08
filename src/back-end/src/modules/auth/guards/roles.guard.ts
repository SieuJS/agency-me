import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { NhanVien } from '@prisma/client';

interface RequestWithUser extends ExpressRequest {
  user: NhanVien;
}

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // Nếu không có user hoặc không phải admin → chặn
    return user?.loai_nhan_vien_id === 'ADMIN';
  }
}
