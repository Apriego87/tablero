import { fail, redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "../$types"
import { writeFileSync } from 'fs'
import { Storage } from '@google-cloud/storage'
import { db } from "$lib";
import { employee, file } from "$lib/schema";
import { eq } from "drizzle-orm";
import { auth } from "$lib/server/auth";

const storage = new Storage({
    projectId: 'dulcet-glyph-422010-n8',
    keyFilename: 'keys\\dulcet-glyph-422010-n8-619d72f660d9.json'
    // keyFilename: '/app/keys/dulcet-glyph-422010-n8-619d72f660d9.json'
});

/* async function disableUniformBucketLevelAccess() {
    // Disables uniform bucket-level access for the bucket
    await storage.bucket('tablero-bucket').setMetadata({
      iamConfiguration: {
        uniformBucketLevelAccess: {
          enabled: false,
        },
      },
    });
  
    console.log(`Uniform bucket-level access was disabled for ${'tablero-bucket'}.`);
  }
  
  disableUniformBucketLevelAccess().catch(console.error);

async function makeBucketPublic() {
    await storage.bucket('tablero-bucket').makePublic();

    console.log(`Bucket ${'tablero-bucket'} is now publicly readable`);
}
makeBucketPublic().catch(console.error); */


export const load: PageServerLoad = async ({ cookies }) => {
    if (!cookies.get('auth_session')) {
        return redirect(302, '/login')
    }
    else {
        const files = await db.select().from(file).where(eq(file.creatorID, cookies.get('userid')))

        return {
            title: 'Almacén de Archivos', files
        }
    }
}

export const actions: Actions = {
    upload: async ({ request, cookies }) => {
        const formData = Object.fromEntries(await request.formData());

        if (
            !(formData.fileToUpload as File).name ||
            (formData.fileToUpload as File).name === 'undefined'
        ) {
            return fail(400, {
                error: true,
                message: 'Debes añadir un archivo.'
            });
        }

        const { fileToUpload } = formData as { fileToUpload: File };

        writeFileSync(`fileStorage/${fileToUpload.name}`, Buffer.from(await fileToUpload.arrayBuffer()));

        try {
            const user = await db.select().from(employee).where(eq(employee.id, cookies.get('userid')));

            const bucket = storage.bucket("gs://tablero-bucket");
            const destination = `${user[0].username}/${fileToUpload.name}`;

            const result = await bucket.upload(`fileStorage/${fileToUpload.name}`, {
                destination: destination,
                public: true,
                metadata: {
                    contentType: fileToUpload.type,
                }
            });

            await db.insert(file).values({
                creatorID: cookies.get('userid'),
                name: fileToUpload.name,
                mime: fileToUpload.type,
                url: result[0].metadata.mediaLink
            })
        } catch (error) {
            console.log('error: ' + error);
        }
    },
    update: async ({ request }) => {
        const data = await request.formData()

        const name = data.get('name')
        const id = data.get('id')

        await db.update(file).set({ name: name }).where(eq(file.id, id))
    },
    delete: async ({ request, cookies }) => {
        const data = await request.formData();

        const fileID = data.get('fileID')

        const dbFile = await db.select().from(file).where(eq(file.id, fileID))
        const user = await db.select().from(employee).where(eq(employee.id, cookies.get('userid')));

        await storage.bucket('gs://tablero-bucket').file(`${user[0].username}/${dbFile[0].name}`).delete()

        await db.delete(file).where(eq(file.id, fileID));

        return { success: true }
    },
    signout: async (event) => {
        if (!event.locals.session) {
            return fail(401);
        }
        await auth.invalidateSession(event.locals.session.id);
        const sessionCookie = auth.createBlankSessionCookie();
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            expires: new Date(0),
            path: "/",
            secure: false
        });

        event.cookies.set('userid', '', {
            expires: new Date(0),
            path: '/',
            secure: false
        });

        return redirect(302, "/login");
    }
}