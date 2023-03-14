import { FieldValue } from 'firebase/firestore'
import {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    DetailedHTMLProps,
} from 'react'

export interface IButton
    extends DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {}

export interface IAnchor
    extends DetailedHTMLProps<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
    > {}

export interface ITask {
    id: string
    title: string
    description: string
    dueDate: number
    createdAt: FieldValue
    completed?: boolean
    project: string
    updatedAt?: FieldValue
}

export interface IProject {
    id: string
    title: string
    color: string
}
