---
layout: layouts/note.njk
tags: ['note', 'bash', 'array']
title: Bash arrays
---

### Initiate an array
```bash
myArray=( element_1 element_2 element_n )
myArray2=(
    element_1
    element_2
    element_n
)
 ```

### Access item by index

```bash
echo ${myArray[2]}
```

### Iterate through array

To iterate over the elements:

```bash
for element in "${array[@]}"
do
    echo "$element"
done
```

To get both the index and the value:

```bash
for index in "${!array[@]}"
do
    echo "$index ${array[index]}"
done
```

### Append element to array

```bash
myarray=()
myarray+=('foo')
myarray+=('bar')
```
