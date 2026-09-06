import React from 'react';
import {Text, type TextStyle} from 'react-native';

type OsisNode =
  | {kind: 'text'; value: string}
  | {kind: 'element'; name: string; attrs: Record<string, string>; children: OsisNode[]};

const SKIP_TAGS = new Set(['note', 'milestone', 'lb', 'pb', 'cb', 'gap', 'catchWord']);

function parseAttributes(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrPattern = /([A-Za-z0-9:_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match: RegExpExecArray | null;

  while ((match = attrPattern.exec(raw)) !== null) {
    const [, key, doubleQuoted, singleQuoted, bare] = match;
    attrs[key] = doubleQuoted ?? singleQuoted ?? bare ?? '';
  }

  return attrs;
}

function parseOsis(xml: string): OsisNode[] {
  const root: OsisNode = {kind: 'element', name: '__root__', attrs: {}, children: []};
  const stack: OsisNode[] = [root];
  const tagPattern = /<\/?([A-Za-z0-9:_-]+)([^>]*)>/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(xml)) !== null) {
    const textBefore = xml.slice(cursor, match.index);
    if (textBefore) {
      const parent = stack[stack.length - 1];
      if (parent.kind === 'element') {
        parent.children.push({kind: 'text', value: textBefore});
      }
    }

    const fullTag = match[0];
    const tagName = match[1];
    const rawAttrs = match[2] ?? '';
    const isClosing = fullTag.startsWith('</');

    if (isClosing) {
      if (stack.length > 1) {
        stack.pop();
      }
    } else {
      const attrs = parseAttributes(rawAttrs);
      const node: OsisNode = {
        kind: 'element',
        name: tagName,
        attrs,
        children: [],
      };

      const parent = stack[stack.length - 1];
      if (parent.kind === 'element') {
        parent.children.push(node);
      }

      if (!rawAttrs.trim().endsWith('/')) {
        stack.push(node);
      }
    }

    cursor = match.index + fullTag.length;
  }

  const trailing = xml.slice(cursor);
  if (trailing) {
    const parent = stack[stack.length - 1];
    if (parent.kind === 'element') {
      parent.children.push({kind: 'text', value: trailing});
    }
  }

  return root.children;
}

function mergeStyles(
  base?: TextStyle,
  extra?: TextStyle,
): TextStyle | undefined {
  if (!base && !extra) {
    return undefined;
  }

  return {
    ...(base ?? {}),
    ...(extra ?? {}),
  };
}

function getTagStyle(name: string, attrs: Record<string, string>): TextStyle | undefined {
  switch (name) {
    case 'hi': {
      const rend = attrs.rend ?? '';
      if (rend === 'italic' || rend === 'i') {
        return {fontStyle: 'italic'};
      }
      if (rend === 'bold' || rend === 'b' || rend === 'strong') {
        return {fontWeight: '700'};
      }
      if (rend === 'sup' || rend === 'super') {
        return {fontSize: 11, lineHeight: 14};
      }
      return undefined;
    }
    case 'title':
      return {fontWeight: '700'};
    case 'transChange':
      return {fontStyle: 'italic'};
    case 'q':
      return {fontStyle: 'italic'};
    default:
      return undefined;
  }
}

function renderNodes(
  nodes: OsisNode[],
  inheritedStyle?: TextStyle,
  prefix = 'osis',
): React.ReactNode[] {
  return nodes.reduce<React.ReactNode[]>((acc, node, index) => {
    if (node.kind === 'text') {
      if (node.value) {
        acc.push(node.value);
      }
      return acc;
    }

    if (SKIP_TAGS.has(node.name)) {
      return acc;
    }

    const tagStyle = getTagStyle(node.name, node.attrs);
    const combinedStyle = mergeStyles(inheritedStyle, tagStyle);
    const children = renderNodes(node.children, combinedStyle, `${prefix}-${index}`);

    if (!children.length) {
      return acc;
    }

    acc.push(
      <Text key={`${prefix}-${index}`} style={combinedStyle}>
        {children}
      </Text>,
    );
    return acc;
  }, []);
}

export function renderOsisRichText(
  rawText: string,
  baseStyle?: TextStyle,
): React.ReactNode {
  const cleaned = rawText ?? '';
  if (!cleaned.trim()) {
    return null;
  }

  const parsed = parseOsis(cleaned);
  const rendered = renderNodes(parsed, baseStyle, 'root');
  return rendered.length === 1 ? rendered[0] : rendered;
}
