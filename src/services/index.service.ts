export function returnByID(bodyId: String, bd: Array<object>) {
    return bd.filter((objectId: any) => objectId.id=== bodyId);
}