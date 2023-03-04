import { MSG_DATA } from "./msg"

export type MessageEvents = {
  msg: (from: MSG_DATA) => void
}