export function formatJSON(data) {
    const isArray = Array.isArray(data);
    if (isArray) {
        return data.map(d => {
            const { _id, __v, ...rest } = d;
            return { id: _id.toString(), ...rest };
        });
    }
    else {
        const { _id, __v, ...rest } = data;
        return {
            id: _id.toString(),
            ...rest
        };
    }
}
