import * as THREE from 'three';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function findIndexOfVectorArray(vectorArray, vector){
    for (let i = 0; i < vectorArray.length; i += 1){
        if(vectorArray[i].x == vector.x && 
            vectorArray[i].y == vector.y &&
            vectorArray[i].z == vector.z){
                return i;
        }
    }

    return -1;
}

export class Block {

    constructor(pos, cube, maxX, maxZ){
        this.pos = pos;
        this.cube = cube;
        this.cube.position.y = this.pos.y;
        this.cube.position.x = this.pos.x;
        this.cube.position.z = this.pos.z;
        this.maxX = maxX;
        this.maxZ = maxZ;
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

        if (potentialCol.length == 9){
            return;
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

        const possibleMovesEdges = [
            new THREE.Vector3(this.pos.x, this.pos.y - 1, this.pos.z + 1),
            new THREE.Vector3(this.pos.x, this.pos.y - 1, this.pos.z - 1),
            new THREE.Vector3(this.pos.x + 1, this.pos.y - 1, this.pos.z),
            new THREE.Vector3(this.pos.x - 1, this.pos.y - 1, this.pos.z)
        ]

        const possibleMovesCorners = [
            new THREE.Vector3(this.pos.x - 1, this.pos.y - 1, this.pos.z - 1),
            new THREE.Vector3(this.pos.x + 1, this.pos.y - 1, this.pos.z + 1),
            new THREE.Vector3(this.pos.x - 1, this.pos.y - 1, this.pos.z + 1),
            new THREE.Vector3(this.pos.x + 1, this.pos.y - 1, this.pos.z - 1),
        ]

        for (const potentialBlock of potentialCol){
            let index = findIndexOfVectorArray(possibleMovesEdges, potentialBlock.position);
            
            if (index > -1){
                possibleMovesEdges.splice(index, 1);
                continue;
            }

            index = findIndexOfVectorArray(possibleMovesCorners, potentialBlock.position);
            if (index > -1){
                possibleMovesCorners.splice(index, 1);
            }
        }

        // remove edges
        const possibleMoves = []
        for (let i = 0; i < possibleMovesEdges.length; i += 1){
            const edge = possibleMovesEdges[i];
            if (edge.x > 0 || edge.z > 0 ||
                 edge.x < this.maxX || edge.z < this.maxZ){
                    continue;
            }
            possibleMoves.push(edge);
        }
        if (possibleMoves.length == 0){
            for (let i = 0; i < possibleMovesCorners.length; i += 1){
                const edge = possibleMovesCorners[i];
                if (edge.x > 0 || edge.z > 0 ||
                    edge.x < this.maxX || edge.z < this.maxZ){
                    continue;
                }
                possibleMoves.push(edge);
            }
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