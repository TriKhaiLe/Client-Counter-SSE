import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('api/events')
export class AppController {
    private connectionCount = 0;

    @Get()
    sendEvents(@Res() res: Response) {
        // Increment the connection count
        this.connectionCount++;
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Send an initial message to the client
        const interval = setInterval(() => {
            const data = {
                time: new Date().toISOString(),
                connections: this.connectionCount,
            };
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        }, 1000);

        // When the client closes the connection, stop sending events
        res.on('close', () => {
            clearInterval(interval);
            this.connectionCount--;
        });
    }
}
