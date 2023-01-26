import { AnchorHTMLAttributes, ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

export interface IButton extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {}

export interface IAnchor extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {}
