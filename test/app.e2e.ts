import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('End To End Testing', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({}).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });
});
