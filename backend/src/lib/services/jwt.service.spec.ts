import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthJwtService } from './jwt.service';

describe('AuthJwtService', () => {
  let service: AuthJwtService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret-key',
        }),
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
      providers: [AuthJwtService],
    }).compile();

    service = module.get<AuthJwtService>(AuthJwtService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = {
        id: '123',
        email: 'test@example.com',
        role: 'team_lead',
      };
      const token = service.generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate different tokens for different payloads', () => {
      const payload1 = { id: '123', email: 'test1@example.com' };
      const payload2 = { id: '456', email: 'test2@example.com' };

      const token1 = service.generateToken(payload1);
      const token2 = service.generateToken(payload2);

      expect(token1).not.toBe(token2);
    });

    it('should generate token with user data', () => {
      const payload = {
        id: 'user123',
        email: 'user@example.com',
        role: 'member',
      };
      const token = service.generateToken(payload);

      const decoded = jwtService.decode(token);
      expect(decoded).toMatchObject(payload);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload = {
        id: '123',
        email: 'test@example.com',
        role: 'team_lead',
      };
      const token = service.generateToken(payload);

      const verified = service.verifyToken(token);
      expect(verified).toMatchObject(payload);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        service.verifyToken(invalidToken);
      }).toThrow();
    });

    it('should throw error for empty token', () => {
      expect(() => {
        service.verifyToken('');
      }).toThrow();
    });
  });
});
