import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from 'A/lib/firebase/admin';
import { adminDb } from 'A/lib/firebase/admin';
import { Place } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await verifyIdToken(token);
    const userId = decodedToken.uid;

    const placesRef = adminDb.collection('users').doc(userId).collection('places');
    const snapshot = await placesRef.get();

    const places: Place[] = [];
    snapshot.forEach((doc) => {
      places.push({ id: doc.id, ...doc.data() } as Place);
    });

    return NextResponse.json({ places });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await verifyIdToken(token);
    const userId = decodedToken.uid;

    const placeData = await request.json();

    const placesRef = adminDb.collection('users').doc(userId).collection('places');
    const docRef = await placesRef.add({
      ...placeData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
