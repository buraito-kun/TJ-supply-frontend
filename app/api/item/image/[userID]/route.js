"use server"

import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(req, { params }){
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `items/upload/itemImage/${params.userID}`, {revalidate: 0, cache: 'no-store'})
  if (!res.ok){
    const imageFile = await fs.promises.readFile(path.join(process.cwd(), "public", "box.png"))
    return new NextResponse(imageFile)
  }

  return new NextResponse(res.body)
}