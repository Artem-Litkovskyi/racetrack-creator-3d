import * as z from 'zod';
import type { ProjectData } from '../hooks/useProjectState.ts';
import { saveString } from './downloads.ts';

const Vec3Schema = z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
});

const CurveNode3Schema = z.object({
    position: Vec3Schema,
    tangentEnd1: Vec3Schema,
    tangentEnd2: Vec3Schema,
});

const ProjectDataSchema = z.object({
    closedPath: z.boolean(),
    profileHeight: z.number(),
    curveNodes: z.array(CurveNode3Schema),
    roadWidths: z.array(z.number()),
})

export function writeProjectFile(data: ProjectData, filename: string) {
    const json = JSON.stringify(data, null, 2);
    saveString(json, `${filename}.json`);
}

export async function readProjectFile(file: File): Promise<ProjectData> {
    const text = await file.text();

    let json: unknown;

    try {
        json = JSON.parse(text);
    } catch {
        throw new Error('Invalid JSON format');
    }

    const parsed = ProjectDataSchema.safeParse(json);

    if (!parsed.success) {
        console.error(parsed.error);
        throw new Error('Invalid project structure');
    }

    return parsed.data;
}