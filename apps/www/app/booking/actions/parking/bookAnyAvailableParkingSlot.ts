import { connect } from "@/lib/mongodb"

export async function bookAnyAvailableParkingSlot(
  dateKey: string,
  userEmail: string,
  plates: string
) {
  const filter = {
    $and: [
      {
        permanent: false,
      },
      {
        "bookings.date": {
          $ne: dateKey,
        },
      },
    ],
  }
  const client = await connect()
  const coll = client.db("booking").collection("parking")
  const cursor = coll.find(filter)
  const result = await cursor.toArray()
  if (result.length <= 0) {
    return false
  }
  const _id = result[0]._id
  await coll.updateOne(
    { _id },
    { $push: { bookings: { date: dateKey, userEmail, plates } } }
  )

  // await coll.findOneAndUpdate(
  //   { _id },
  //   { $set: user },
  //   { returnDocument: "after" }
  // )
  await client.close()
  return true
}
