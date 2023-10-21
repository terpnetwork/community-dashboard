import { assets } from 'chain-registry';
import { AssetList, Asset } from '@chain-registry/types';

export const defaultChainName = 'terpnetwork';

export const getChainAssets = (chainName: string = defaultChainName) => {
  return assets.find((chain) => chain.chain_name === chainName) as AssetList;
};

export const getDelegationCoin = (chainName: string = defaultChainName) => {
  const chainAssets = getChainAssets(chainName);
  return chainAssets.assets[0] as Asset;
};


export const getFeeCoin = (chainName: string = defaultChainName) => {
  const chainAssets = getChainAssets(chainName);
  return chainAssets.assets[1] as Asset;
};
