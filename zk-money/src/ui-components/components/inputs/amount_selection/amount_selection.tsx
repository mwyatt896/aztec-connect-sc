import type { RemoteAsset } from 'alt-model/types';
import type { StrOrMax } from 'alt-model/forms/constants';
import { assetIsSupportedForShielding } from 'alt-model/shield/shieldable_assets';
import { useState, useMemo } from 'react';
import { Dropdown, DropdownOption } from 'components/dropdown';
import { ShieldedAssetIcon } from 'components';
import { AmountInput } from 'ui-components';
import downArrow from '../../../images/down_arrow.svg';
import style from './amount_selection.module.scss';

interface AmountSelectionProps {
  asset: RemoteAsset;
  assets?: RemoteAsset[];
  maxAmount: bigint;
  amountStringOrMax: StrOrMax;
  onChangeAmountStringOrMax: (amountStringOrMax: StrOrMax) => void;
  onChangeAsset?: (option: number) => void;
  allowAssetSelection?: boolean;
}

export function AmountSelection(props: AmountSelectionProps) {
  const [isAssetSelectorOpen, setAssetSelectorOpen] = useState(false);

  const toggleAssetSelector = () => {
    setAssetSelectorOpen(prevValue => !prevValue);
  };

  const options = useMemo(
    () =>
      props.assets?.filter(x => assetIsSupportedForShielding(x.address)).map(x => ({ value: x.id, label: x.symbol })),
    [props.assets],
  ) as DropdownOption<number>[] | undefined;

  return (
    <div className={style.inputWrapper}>
      {props.allowAssetSelection && props.assets && options && (
        <div className={style.assetSelectorWrapper}>
          <div className={style.assetSelector} onClick={toggleAssetSelector}>
            <div className={style.assetDisplay}>
              <ShieldedAssetIcon address={props.asset.address} />
              <div className={style.assetName}>{props.asset.symbol}</div>
            </div>
            <img src={downArrow} alt="" />
          </div>
          <Dropdown
            isOpen={isAssetSelectorOpen}
            options={options}
            onClick={e => props.onChangeAsset && props.onChangeAsset(e.value)}
            onClose={toggleAssetSelector}
          />
        </div>
      )}
      <AmountInput
        maxAmount={props.maxAmount}
        asset={props.asset}
        onChangeValue={props.onChangeAmountStringOrMax}
        value={props.amountStringOrMax}
      />
    </div>
  );
}
