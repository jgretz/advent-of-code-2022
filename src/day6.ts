import {data} from './data-prod/day6';

const isMarker = (group: string) => new Set(Array.from(group)).size === group.length;

const findMarkerInPack = (packet: string, markerLength: number) => {
  for (let i = 0; i < packet.length - markerLength; i++) {
    if (isMarker(packet.substring(i, i + markerLength))) {
      return i + markerLength - 1;
    }
  }

  return -1;
};

const startOfPacket = findMarkerInPack(data, 4);
console.log(`Challenge 1: Marker: ${startOfPacket + 1}`);

const startOfMessage = findMarkerInPack(data, 14);
console.log(`Challenge 2: Marker: ${startOfMessage + 1}`);
