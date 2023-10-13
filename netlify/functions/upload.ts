import busboy from 'busboy';
import { Handler } from '@netlify/functions';

type Fields = {
    image: {
        filename: string;
        type: string;
        content: Buffer;
    }[];
};

function parseMultipartForm(event): Promise<Fields> {
    return new Promise((resolve) => {
        const fields = { image: [] };
        const bb = busboy({ headers: event.headers });

        bb.on('file', (name, file, info) => {
            const { filename, mimeType } = info;

            file.on('data', (data) => {
                if (!fields[name]) fields[name] = [];

                fields[name].push({
                    filename,
                    type: mimeType,
                    content: data,
                });
            });
        });

        bb.on('close', () => {
            resolve(fields);
        });

        bb.end(Buffer.from(event.body, 'base64'));
    });
}

export const handler: Handler = async (event) => {
    try {
        const fields = await parseMultipartForm(event);

        if (!fields) {
            throw new Error('Unable to parse image');
        }

        console.log('fields is: ', fields);
        console.log('image is: ', fields.image);

        const image = fields.image[0];

        // Handle image however you want here...

        return {
            statusCode: 200,
            body: JSON.stringify(image),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: error.toString(),
        };
    }
};