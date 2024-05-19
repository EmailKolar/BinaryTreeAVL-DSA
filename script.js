window.addEventListener("load", start);

function start() {
  console.log("Ready.");
  let root = tree.createRootNode(50);
  // TODO: when the addItem function is working - remove this line:
  

 
  tree.addItem(30);
  tree.addItem(70);
  tree.addItem(20);
  tree.addItem(40);
  tree.addItem(10);
  tree.addItem(25);
  tree.addItem(45);
  tree.addItem(60);
  tree.addItem(80);



}



class BinaryTree {
  constructor() {
    this.root = null;
  }

  createRootNode(item) {
    this.root = this.createChild(item);
    return this.root;
  }

  createChild(item, parent = null) {
    return {
      parent: parent,
      left: null,
      right: null,
      item: item,
      height: 0
    };
  }

  addItem(itemValue){
    let node = this.root;

    while(node){
        if(itemValue == node.item){
            console.log("item alreaady exist");
            return;
        }
        if(itemValue > node.item){
            if (node.right){
                node = node.right;
            } else{
                node.right = this.createChild(itemValue, node)
                this.maintain(node);
                return;
            }
        } else {
            if(node.left){
                node = node.left;
            } else {
                node.left = this.createChild(itemValue, node);
                this.maintain(node);
                return;
            }
        }
    }
  }

  dfs(node){
    if (!node){
        return
    }
    this.dfs(node.left);
    console.log(node.item);
    this.dfs(node.right);
  }
  updateHeight(node){
    let leftHeight = node.left ? node.left.height : -1;
    let rightHeight = node.right ? node.right.height : -1;
    node.height = Math.max(leftHeight,rightHeight)+1;
  }
  maintain(node){
    this.updateHeight(node);
    if(this.skew(node)<0){
        console.log('hælder venstre');
    } else if(this.skew(node) > 0){
        console.log('hælder højre');
    }
    if(node.parent){
        this.maintain(node.parent)
    }
  }

  skew(node){
    let leftHeight = node.left ? node.left.height : -1;
    let rightHeight = node.right ? node.right.height : -1;
    return rightHeight - leftHeight;
  }

  skew(node) {
    let leftHeight = node.left ? node.left.height : -1;
    let rightHeight = node.right ? node.right.height : -1;
    return rightHeight - leftHeight;
  }

  rotateRight(node) {
    let leftChild = node.left;
    node.left = leftChild.right;
    if (leftChild.right) {
      leftChild.right.parent = node;
    }
    leftChild.parent = node.parent;
    if (!node.parent) {
      this.root = leftChild;
    } else if (node === node.parent.right) {
      node.parent.right = leftChild;
    } else {
      node.parent.left = leftChild;
    }
    leftChild.right = node;
    node.parent = leftChild;

    this.updateHeight(node);
    this.updateHeight(leftChild);
  }

  rotateLeft(node) {
    let rightChild = node.right;
    node.right = rightChild.left;
    if (rightChild.left) {
      rightChild.left.parent = node;
    }
    rightChild.parent = node.parent;
    if (!node.parent) {
      this.root = rightChild;
    } else if (node === node.parent.left) {
      node.parent.left = rightChild;
    } else {
      node.parent.right = rightChild;
    }
    rightChild.left = node;
    node.parent = rightChild;

    this.updateHeight(node);
    this.updateHeight(rightChild);
  }

  contains(itemValue) {
    let node = this.root;
    while (node) {
      if (itemValue === node.item) {
        return true;
      }
      if (itemValue > node.item) {
        node = node.right;
      } else {
        node = node.left;
      }
    }
    return false;
  }

  first() {
    let node = this.root;
    while (node.left) {
      node = node.left;
    }
    return node.item;
  }

  last() {
    let node = this.root;
    while (node.right) {
      node = node.right;
    }
    return node.item;
  }

  traverse(node = this.root) {
    if (node) {
      this.traverse(node.left);
      console.log(node.item);
      this.traverse(node.right);
    }
  }

  replaceChild(parent, oldChild, newChild) {
    if (!parent) {
      this.root = newChild;
    } else if (parent.left === oldChild) {
      parent.left = newChild;
    } else {
      parent.right = newChild;
    }
    if (newChild) {
      newChild.parent = parent;
    }
  }


  print() {
    // Print the tree in a nice way - by creating a (jagged) 2D array of the tree
    // each level (starting from root) is an array in the array that doubles in size from the previous level

    // breaks if the tree is too deep - but that's a problem for another day
     
    // Use DFS to fill array with values
    const treeArray = [];
    let height = 0; // and while we're at it, calculate the height of the tree
    buildTreeArray(this.root, 0, 0);

    // Does a Depth-First-Scan of the Tree,
    // keeping track of the current depth (how far down from the top)
    // and the current indent (how far right from the (possible) left-most node at this depth)
    // stores the node values in a 2D array
    function buildTreeArray(node, depth, indent) {
      if (!node) {
        return;
      }
      height = Math.max(height, depth);
      // insert this node value in the 2D array
      if(!treeArray[depth]) treeArray[depth] = [];
      treeArray[depth][indent] = node.item;
      // visit its children - remember to double indent
      buildTreeArray(node.left, depth + 1, indent * 2);
      buildTreeArray(node.right, depth + 1, indent * 2 + 1);
    }

    // Apparently I'm not smart enough to calculate these, so here's a pre-calculated list
    const indentations = [1, 2, 5, 11, 23, 46, 93];

    let treeString = " ";
    // Display array - one level at a time
    for (let depth = 0; depth < treeArray.length; depth++) {
      const values = treeArray[depth];

      // Calculate indent for this depth (or find it in the pre-calculated table)
      let currentHeight = height - depth; // currentHeight is the distance from the bottom of the tree
      let indent = indentations[currentHeight];

      // Only display tree structure if we are not at the top
      if (depth > 0) {
        // Loop through half the values - and show a subtree with left and right
        for (let i = 0; i < values.length / 2; i++) {
          treeString += " ".repeat(indent);
          // Only show sub-tree if there are some values below
          if (values[i * 2] != undefined || values[i * 2 + 1] != undefined) {
            treeString += "┌";
            treeString += "─".repeat(indent > 1 ? indent : 0);
            treeString += "┴";
            treeString += "─".repeat(indent > 1 ? indent : 0);
            treeString += "┐";
          } else {
            treeString += "   " + "  ".repeat(indent > 1 ? indent : 0);
          }
          treeString += " ".repeat(indent);
          // add a single space before the next "block"
          treeString += " ";
        }
        // and finalize the current line
        treeString += "\n";
      }

      // Indent numbers one less than their "tree drawings"
      // Unless it is the first one, then it is two (or maybe three) less ... mystic math!
      if (depth == 0) {
        treeString += " ".repeat(indent - 2);
      } else {
        treeString += " ".repeat(indent - 1);
      }

      // display values
      for (let i = 0; i < values.length; i++) {
        // if both children are undefined, don't show any of then
        // if only one child is, show it as underscores _
        const showUndefined = !values[i - (i % 2)] && !values[i - (i % 2) + 1] ? " " : "_";
        // if depth is lowest (height-1) - pad values to two characters
        if (depth == height)  {
          treeString += String(values[i] ?? showUndefined.repeat(2)).padStart(2, " ");
          // and add a single space
          treeString += " ";
        } else {
          // otherwise center values in block of three
          treeString += String(values[i] ?? showUndefined.repeat(3)).padEnd(2, " ").padStart(3, " ");

          // and add twice the indentation of spaces + 1 in the middle
          treeString += " ".repeat(indent - 1);
          treeString += " ";
          treeString += " ".repeat(indent - 1);
        }
      }

      // finalize the value-line
      treeString += "\n";
    }

    console.log(treeString);
  }
}

// at the very last - so that everything is ready
const tree = new BinaryTree();