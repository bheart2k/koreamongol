'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProfileImageCropper } from '@/components/profile';
import { toast } from 'sonner';
import {
  Loader2,
  Camera,
  User,
  Edit3,
  Save,
  X,
  LogOut,
} from 'lucide-react';
import AdBanner from '@/components/ui/ad-banner';

export default function MyPage() {
  const { data: session, status, update: updateSession } = useSession();
  const locale = 'ko';
  const fileInputRef = useRef(null);

  // 프로필 이미지 크롭
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // 프로필 수정 모드
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    bio: '',
  });
  const [userData, setUserData] = useState(null);

  // 사용자 데이터 로드
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session?.user?.id]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/users/${session.user.id}`);
      const result = await res.json();
      if (result.success) {
        setUserData(result.data);
        setFormData({
          nickname: result.data.nickname || '',
          bio: result.data.bio || '',
        });
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
    }
  };

  // 프로필 이미지 클릭
  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5MB 제한
    if (file.size > 5 * 1024 * 1024) {
      toast.error('이미지 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // FileReader로 미리보기용 URL 생성
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);

    // input 초기화 (같은 파일 재선택 가능하도록)
    e.target.value = '';
  };

  // 프로필 이미지 업로드 성공 시
  const handleProfileUploadSuccess = async (imageUrl) => {
    try {
      // DB 업데이트
      const res = await fetch(`/api/users/${session.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl }),
      });

      const result = await res.json();

      if (result.success) {
        // 세션 업데이트
        await updateSession({ image: imageUrl });
        setUserData((prev) => ({ ...prev, image: imageUrl }));
        toast.success('프로필 이미지가 변경되었습니다.');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      toast.error('프로필 저장에 실패했습니다.');
    }
  };

  // 프로필 정보 저장
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      const res = await fetch(`/api/users/${session.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: formData.nickname.trim(),
          bio: formData.bio.trim(),
        }),
      });

      const result = await res.json();

      if (result.success) {
        // 세션 업데이트
        await updateSession({ nickname: formData.nickname.trim() });
        setUserData((prev) => ({
          ...prev,
          nickname: formData.nickname.trim(),
          bio: formData.bio.trim(),
        }));
        setIsEditing(false);
        toast.success('프로필이 저장되었습니다.');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      toast.error('프로필 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setFormData({
      nickname: userData?.nickname || '',
      bio: userData?.bio || '',
    });
    setIsEditing(false);
  };

  // 로딩 중
  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 비로그인 상태
  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <User className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">
          {locale === 'ko' ? '로그인이 필요합니다' : 'Login required'}
        </h2>
        <p className="text-muted-foreground text-center">
          {locale === 'ko'
            ? '마이페이지를 이용하려면 로그인해주세요.'
            : 'Please login to access your profile.'}
        </p>
        <Button onClick={() => signIn('google')}>
          {locale === 'ko' ? '로그인' : 'Login'}
        </Button>
      </div>
    );
  }

  const displayImage = userData?.image || session.user.image;
  const displayNickname = userData?.nickname || session.user.nickname;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {locale === 'ko' ? '마이페이지' : 'My Page'}
      </h1>

      {/* 프로필 카드 */}
      <div className="bg-card rounded-xl border p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* 프로필 이미지 */}
          <div className="flex justify-center sm:justify-start">
            <div
              className="relative cursor-pointer group"
              onClick={handleProfileClick}
            >
              {displayImage ? (
                <img
                  src={displayImage}
                  alt=""
                  className="w-24 h-24 rounded-full border-2 border-primary object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
              )}
              {/* 카메라 아이콘 오버레이 */}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
              {/* 우하단 작은 카메라 뱃지 */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                <Camera className="w-4 h-4 text-primary-foreground" />
              </div>
              {/* 숨겨진 파일 입력 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* 프로필 정보 */}
          <div className="flex-1 space-y-4">
            {isEditing ? (
              <>
                {/* 수정 모드 */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="nickname">
                      {locale === 'ko' ? '닉네임' : 'Nickname'}
                    </Label>
                    <Input
                      id="nickname"
                      value={formData.nickname}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          nickname: e.target.value,
                        }))
                      }
                      placeholder={locale === 'ko' ? '닉네임 입력' : 'Enter nickname'}
                      maxLength={20}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.nickname.length}/20
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="bio">
                      {locale === 'ko' ? '자기소개' : 'Bio'}
                    </Label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder={
                        locale === 'ko'
                          ? '자기소개를 입력하세요'
                          : 'Tell us about yourself'
                      }
                      maxLength={200}
                      rows={3}
                      className="mt-1 w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.bio.length}/200
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-1" />
                    )}
                    {locale === 'ko' ? '저장' : 'Save'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-1" />
                    {locale === 'ko' ? '취소' : 'Cancel'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* 보기 모드 */}
                <div>
                  <h2 className="text-xl font-semibold">
                    {displayNickname || (locale === 'ko' ? '닉네임을 설정해주세요' : 'Set your nickname')}
                  </h2>
                </div>
                {userData?.bio && (
                  <p className="text-sm text-muted-foreground">{userData.bio}</p>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  {locale === 'ko' ? '프로필 수정' : 'Edit Profile'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 통계 카드 (userData가 있을 때만 표시) */}
      {userData?.stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl border p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {userData.stats.postsCount || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              {locale === 'ko' ? '게시글' : 'Posts'}
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {userData.stats.commentsCount || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              {locale === 'ko' ? '댓글' : 'Comments'}
            </div>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {userData.points || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              {locale === 'ko' ? '포인트' : 'Points'}
            </div>
          </div>
        </div>
      )}

      {/* 로그아웃 */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        <LogOut className="w-4 h-4 mr-2" />
        {locale === 'ko' ? '로그아웃' : 'Logout'}
      </Button>

      {/* 광고 */}
      <div className="mt-8">
        <AdBanner type="display" />
      </div>

      {/* 프로필 이미지 크롭 다이얼로그 */}
      <ProfileImageCropper
        open={cropperOpen}
        onClose={() => {
          setCropperOpen(false);
          setSelectedImage(null);
        }}
        imageSrc={selectedImage}
        userId={session?.user?.id}
        onSuccess={handleProfileUploadSuccess}
      />
    </div>
  );
}
