#!/bin/bash

# GitHub 배포 설정 스크립트
# 이 스크립트는 GitHub 저장소를 설정하고 코드를 업로드합니다

echo "🚀 GitHub 배포 설정을 시작합니다..."
echo ""

# 1. Git 초기화 확인
if [ ! -d ".git" ]; then
    echo "📦 Git 저장소 초기화 중..."
    git init
    echo "✅ Git 초기화 완료"
else
    echo "✅ Git 저장소가 이미 초기화되어 있습니다"
fi

echo ""
echo "📝 GitHub 저장소 URL을 입력해주세요."
echo "   예: https://github.com/사용자명/저장소명.git"
read -p "GitHub URL: " GITHUB_URL

if [ -z "$GITHUB_URL" ]; then
    echo "❌ URL이 입력되지 않았습니다. 스크립트를 종료합니다."
    exit 1
fi

echo ""
echo "🔄 원격 저장소 설정 중..."
git remote remove origin 2>/dev/null
git remote add origin "$GITHUB_URL"
echo "✅ 원격 저장소 설정 완료: $GITHUB_URL"

echo ""
echo "📤 파일 추가 중..."
git add .

echo ""
echo "💾 커밋 생성 중..."
git commit -m "Initial commit: SJ Mobile Partner Center" || {
    echo "⚠️  변경사항이 없거나 이미 커밋되어 있습니다."
}

echo ""
echo "🌿 브랜치를 main으로 설정 중..."
git branch -M main

echo ""
echo "📤 GitHub에 코드 업로드 중..."
echo "   (GitHub 로그인을 요구할 수 있습니다)"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 성공! GitHub에 코드가 업로드되었습니다!"
    echo ""
    echo "다음 단계:"
    echo "1. https://vercel.com 접속"
    echo "2. GitHub로 로그인"
    echo "3. 'Add New Project' 클릭"
    echo "4. 방금 업로드한 저장소 선택"
    echo "5. Deploy 클릭"
    echo ""
else
    echo ""
    echo "❌ 업로드 실패"
    echo ""
    echo "문제 해결:"
    echo "1. GitHub 저장소가 올바르게 생성되었는지 확인"
    echo "2. GitHub Personal Access Token 사용 (비밀번호 대신)"
    echo "3. GitHub CLI 사용: brew install gh && gh auth login"
    echo ""
fi

