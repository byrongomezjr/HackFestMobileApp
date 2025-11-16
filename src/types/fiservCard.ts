// Fiserv Card Types - Based on Fiserv Card Structure

export interface FiservCard {
  PartyCardRelInfo: PartyCardRelInfo[];
  CardInfo: CardInfo;
}

export interface PartyCardRelInfo {
  PartyRef: {
    PartyKeys: {
      PartyIdentType: string;
      PartyIdent: string;
    };
  };
  PartyCardRelType: string;
}

export interface CardInfo {
  CardNum: string;
  CardType: string;
  ProductIdent: string;
  InstantIssuedInd: boolean;
  CardFee?: CardFee[];
  ExpDt: string;
  CardCategory: string;
  EmbossingName: string;
  SecondaryEmbossingName?: string;
  PostAddr?: PostAddr[];
  CardTrnLimit?: CardTrnLimit[];
  Nickname?: string;
  PINOffset?: string;
  RefData?: RefData[];
  AcctLinkData?: AcctLinkData[];
}

export interface CardFee {
  CardFeeType: string;
}

export interface PostAddr {
  Addr1: string;
  Addr2?: string;
  Addr3?: string;
  City: string;
  StateProv: string;
  PostalCode: string;
  Country: string;
  AddrType: string;
}

export interface CardTrnLimit {
  TrnTypeValue: string;
  TrnSrc: string;
  CurAmt: {
    Amt: number;
    CurCode: {
      CurCodeType: string;
      CurCodeValue: string;
    };
  };
}

export interface RefData {
  RefType: string;
  RefIdent: string;
}

export interface AcctLinkData {
  AcctRef: {
    AcctKeys: {
      AcctId: string;
      AcctType: string;
    };
  };
  OtherAcctRel: number;
  IsPrimaryAddress: boolean;
}

// Simplified Card Display (for UI)
export interface WalletCard {
  id: string;
  cardNum: string;
  last4: string;
  cardType: string;
  cardBrand: 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Other';
  nickname: string;
  embossingName: string;
  expDt: string;
  balance: number;
  currency: string;
  isDefault: boolean;
  fiservData: FiservCard;
  addedDate: string;
}

// Helper to get card brand from card number
export function getCardBrand(cardNum: string): 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Other' {
  const firstDigit = cardNum.charAt(0);
  const firstTwoDigits = cardNum.substring(0, 2);
  
  if (firstDigit === '4') return 'Visa';
  if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return 'Mastercard';
  if (['34', '37'].includes(firstTwoDigits)) return 'Amex';
  if (firstTwoDigits === '60' || firstTwoDigits === '65') return 'Discover';
  
  return 'Other';
}

// Helper to mask card number
export function maskCardNumber(cardNum: string): string {
  const last4 = cardNum.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

// Helper to convert Fiserv card to WalletCard
export function fiservCardToWalletCard(fiservCard: FiservCard, balance: number = 0): WalletCard {
  const cardInfo = fiservCard.CardInfo;
  const last4 = cardInfo.CardNum.slice(-4);
  const cardBrand = getCardBrand(cardInfo.CardNum);
  
  return {
    id: `CARD_${Date.now()}`,
    cardNum: cardInfo.CardNum,
    last4,
    cardType: cardInfo.CardType,
    cardBrand,
    nickname: cardInfo.Nickname || `${cardBrand} ${last4}`,
    embossingName: cardInfo.EmbossingName,
    expDt: cardInfo.ExpDt,
    balance,
    currency: 'USD',
    isDefault: false,
    fiservData: fiservCard,
    addedDate: new Date().toISOString(),
  };
}

