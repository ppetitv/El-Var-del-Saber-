export function getDicebearAvatar(seed: string, size = 96) {
  const params = new URLSearchParams({
    seed,
    size: String(size),
    radius: '50',
    backgroundType: 'solid',
    backgroundColor: 'b6e3f4,c0aede,d1d4f9,ffdfbf,f2d3b1',
    skinColor: '623d36,92594b,b16a5b,d78774,e5a07e,e7a391,eeb4a4',
    clothingColor: '0d74c8,12c86f,f7c600,16314c',
    hairColor: '2b2118,3b3024,5c4033,8b5e3c,c98f5a',
  });

  return `https://api.dicebear.com/9.x/personas/svg?${params.toString()}`;
}
