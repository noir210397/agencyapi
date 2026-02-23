import { FlattenMaps, Types } from "mongoose"
type WithIdandVersion = {
    _id: Types.ObjectId,
    __v: number
}
export function formatJSON<T extends WithIdandVersion>(data: FlattenMaps<T>[] | FlattenMaps<T>) {
    const isArray = Array.isArray(data)
    if (isArray) {
        return data.map(d => {
            const { _id, __v, ...rest } = d
            return { id: _id.toString(), ...rest }
        })
    }
    else {
        const { _id, __v, ...rest } = data
        return {
            id: _id.toString(),
            ...rest
        }
    }
}