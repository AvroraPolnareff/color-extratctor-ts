import {createCanvas, loadImage} from "canvas";
import {readdir, writeFile} from "node:fs/promises";
const Color = require("color");

const ROWS_COUNT = 18
const COLUMNS_COUNT = 5;

export interface Palette {
 name: string,
 colors: PaletteColor[]
}

export interface PaletteColor {
 hex: string,
 position: Position
}

export interface Position {
 x: number,
 y: number
}

const scanPalette = async (path: string): Promise<PaletteColor[]> => {
 const image = await loadImage(path)
 const canvas = createCanvas(image.width, image.height)
 const ctx = canvas.getContext("2d")

 ctx.drawImage(image, 0, 0, image.width, image.height)
 const yStep = image.height / ROWS_COUNT
 const xStep = image.width / COLUMNS_COUNT
 let colors: PaletteColor[] = []
 for (let y = 0; y < ROWS_COUNT; y++) {
  for (let x = 0; x < COLUMNS_COUNT; x++) {
   const width = Math.floor(xStep / 2 + xStep * x);
   const height = Math.floor(yStep / 2 + yStep * y);
   const pixel = Color(ctx.getImageData(width, height, 1, 1).data, "rgb").hex()
   colors.push({hex: pixel, position: {x, y}})
  }
 }
 return colors;
}

const readPalettes = async () : Promise<Palette[]> => {
 const files: string[] = await readdir("./palettes")
 return Promise.all(files.map(async file => {
  const name = file.slice(file.lastIndexOf("/") + 1, file.lastIndexOf("."))
  const colors = await scanPalette(`./palettes/${file}`);
  return {name, colors}
 }))
}


readPalettes().then(palettes => writeFile("./palettes.json", JSON.stringify(palettes)))


//106 377
