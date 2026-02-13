'use client';

import { DecoratorNode, $applyNodeReplacement } from 'lexical';
import Image from 'next/image';
import { useState } from 'react';

/**
 * 이미지 노드 클래스
 * Lexical 에디터에서 이미지를 표시하기 위한 커스텀 노드
 */
export class ImageNode extends DecoratorNode {
  __src;
  __altText;
  __width;
  __height;

  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key);
  }

  constructor(src, altText = '', width = 'auto', height = 'auto', key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  // JSON으로 직렬화
  static importJSON(serializedNode) {
    const { src, altText, width, height } = serializedNode;
    return $createImageNode({ src, altText, width, height });
  }

  exportJSON() {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
    };
  }

  // DOM 생성 (에디터용)
  createDOM() {
    const span = document.createElement('span');
    span.className = 'editor-image-wrapper';
    return span;
  }

  updateDOM() {
    return false;
  }

  // React 컴포넌트로 렌더링
  decorate() {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        nodeKey={this.__key}
      />
    );
  }

  // Getter
  getSrc() {
    return this.__src;
  }

  getAltText() {
    return this.__altText;
  }
}

/**
 * 이미지 컴포넌트 (렌더링용)
 */
function ImageComponent({ src, altText, width, height, nodeKey }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // src가 없거나 유효하지 않은 경우
  if (!src || hasError) {
    return (
      <div
        className="my-2 bg-muted rounded-lg flex items-center justify-center text-muted-foreground"
        style={{ width: '100%', maxWidth: '800px', aspectRatio: '4/3' }}
        data-node-key={nodeKey}
      >
        <span className="text-sm">이미지를 불러올 수 없습니다</span>
      </div>
    );
  }

  // next/image는 width/height가 필요하므로 기본값 설정
  const imgWidth = width === 'auto' ? 800 : parseInt(width) || 800;
  const imgHeight = height === 'auto' ? 600 : parseInt(height) || 600;

  return (
    <div className="my-2" data-node-key={nodeKey}>
      <Image
        src={src}
        alt={altText || ''}
        width={imgWidth}
        height={imgHeight}
        sizes="(max-width: 768px) 100vw, 800px"
        className="block rounded-lg max-w-full h-auto"
        draggable={false}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

/**
 * ImageNode 생성 헬퍼 함수
 */
export function $createImageNode({ src, altText = '', width = 'auto', height = 'auto' }) {
  return $applyNodeReplacement(new ImageNode(src, altText, width, height));
}

/**
 * ImageNode 여부 확인
 */
export function $isImageNode(node) {
  return node instanceof ImageNode;
}
