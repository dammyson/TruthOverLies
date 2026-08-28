import React from 'react';

import BoldCenterArrangement from './arrangements/BoldCenterArrangement';
import ClassicArrangement from './arrangements/ClassicArrangement';
import FramedArrangement from './arrangements/FramedArrangement';
import SideAccentArrangement from './arrangements/SideAccentArrangement';
import {ShareArrangementId} from './shareArrangementCatalog';
import {ShareArrangementProps} from './shareDesignTypes';

const SHARE_ARRANGEMENT_COMPONENTS: Record<
  ShareArrangementId,
  React.ComponentType<ShareArrangementProps>
> = {
  classic: ClassicArrangement,
  'side-accent': SideAccentArrangement,
  'bold-center': BoldCenterArrangement,
  framed: FramedArrangement,
};

export function renderShareArrangement(
  arrangementId: ShareArrangementId,
  props: ShareArrangementProps,
) {
  const Arrangement = SHARE_ARRANGEMENT_COMPONENTS[arrangementId];
  return <Arrangement {...props} />;
}

export {SHARE_ARRANGEMENT_COMPONENTS};
