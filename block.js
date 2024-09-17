import * as THREE from 'three';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export class Block {

    constructor(pos, cube){
        this.pos = pos;
        this.cube = cube;
        this.cube.position.y = this.pos.y;
        this.cube.position.x = this.pos.x;
        this.cube.position.z = this.pos.z;
    }

    get position() {
        return this.pos;
    }

    set position(newPos){
        this.pos = newPos;
    }

    move(otherBlocks) {
        if (this.pos.y == 0){
            return;
        }
        let potentialCol = []
        // get all potential colls
        for (const otherBlock of otherBlocks){
            if (otherBlock.position.y == this.pos.y - 1 && Math.abs(otherBlock.position.x - this.pos.x) <= 1 && Math.abs(otherBlock.position.z - this.pos.z) <= 1){
                potentialCol.push(otherBlock)
            }
        }

        // check if something is just under the block
        let canMoveDown = true;
        for (const potentialBlock of potentialCol){
            if (potentialBlock.position.z == this.pos.z && potentialBlock.position.x == this.pos.x){
                canMoveDown = false;
                break;
            }
        }
        if (canMoveDown){
            this.pos.y -= 1;
            this.cube.position.y -= 1;
            return;
        }

        // check if there are other possible moves 

        let possibleMoves = [
            new THREE.Vector3(this.pos.x - 1, this.pos.y - 1, this.pos.z - 1),
            new THREE.Vector3(this.pos.x + 1, this.pos.y - 1, this.pos.z + 1),
            new THREE.Vector3(this.pos.x, this.pos.y - 1, this.pos.z + 1),
            new THREE.Vector3(this.pos.x, this.pos.y - 1, this.pos.z - 1),
            new THREE.Vector3(this.pos.x + 1, this.pos.y - 1, this.pos.z),
            new THREE.Vector3(this.pos.x - 1, this.pos.y - 1, this.pos.z)
        ]
        for (const potentialBlock of potentialCol){
            possibleMoves.splice(possibleMoves.indexOf(potentialBlock.pos), 1)
        }

        if (possibleMoves.length > 0){
            const newPos = possibleMoves[ getRandomInt(possibleMoves.length - 1)];
            this.pos.y = newPos.y;
            this.cube.position.y = newPos.y;
            this.pos.x = newPos.x;
            this.cube.position.x = newPos.x;
            this.pos.z = newPos.z;
            this.cube.position.z = newPos.z;
        }
    }
}