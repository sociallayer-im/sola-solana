import { createContext } from 'react'
import en from "./en"

export enum LangType {
    cn='cn',
    th='th',
    en='en'
}

const LangContext  = createContext({
    langType: 'en',
    switchLang: (type: LangType):void => {},
    lang: en
})

export default LangContext
