import { NextResponse } from 'next/server';
import { auth, isAdmin } from '@/lib/auth';
import { r2Client, r2Config, ListObjectsV2Command, DeleteObjectCommand } from '@/lib/r2-config';

/**
 * GET /api/admin/images
 * R2 이미지 목록 조회
 * Query: prefix, maxKeys, continuationToken
 */
export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (!isAdmin(session)) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix') || '';
    const maxKeys = parseInt(searchParams.get('maxKeys') || '100');
    const continuationToken = searchParams.get('continuationToken');

    const command = new ListObjectsV2Command({
      Bucket: r2Config.bucket,
      Prefix: prefix,
      MaxKeys: maxKeys,
      ...(continuationToken && { ContinuationToken: continuationToken }),
    });

    const response = await r2Client.send(command);

    const images = (response.Contents || []).map((item) => ({
      key: item.Key,
      url: `${r2Config.publicUrl}/${item.Key}`,
      size: item.Size,
      lastModified: item.LastModified,
    }));

    return NextResponse.json({
      success: true,
      data: {
        images,
        isTruncated: response.IsTruncated || false,
        nextContinuationToken: response.NextContinuationToken || null,
        keyCount: response.KeyCount || 0,
      },
    });
  } catch (error) {
    console.error('Admin images list API error:', error);
    return NextResponse.json(
      { error: '이미지 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/images
 * R2 이미지 삭제
 * Query: keys (쉼표로 구분된 키 목록)
 */
export async function DELETE(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (!isAdmin(session)) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const keysParam = searchParams.get('keys');

    if (!keysParam) {
      return NextResponse.json(
        { error: '삭제할 이미지 키가 필요합니다.' },
        { status: 400 }
      );
    }

    const keys = keysParam.split(',').map((k) => k.trim()).filter(Boolean);

    if (keys.length === 0) {
      return NextResponse.json(
        { error: '삭제할 이미지 키가 필요합니다.' },
        { status: 400 }
      );
    }

    const deleted = [];
    const failed = [];

    for (const key of keys) {
      try {
        const command = new DeleteObjectCommand({
          Bucket: r2Config.bucket,
          Key: key,
        });
        await r2Client.send(command);
        deleted.push(key);
      } catch (error) {
        console.error(`Failed to delete ${key}:`, error);
        failed.push(key);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        deleted,
        failed,
      },
    });
  } catch (error) {
    console.error('Admin images delete API error:', error);
    return NextResponse.json(
      { error: '이미지 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
