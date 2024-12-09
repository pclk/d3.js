# Setting up DE for d3.js
Because (I use neovim btw), we have to install npm live server. 

And for convenience, we are going to install it globally.
```sh
npm i -g live-server
```
Interestingly i had to sudo it.
```sh
sudo npm i -g live-server
```
## Usage
`cd` to your index.html and run `live-server` in your terminal.

## Type hints
run the following in your project dir
```sh
npm install @types/d3 --save-dev
```
installing d3 is not needed if you import it in your index.html as a script tag.

## Notes

1. Select and append a chart with an svg by doing:
```js
const svg = d3.select("#id-of-ele")
  .append("svg")
  .attr("width", 9999)
  .attr("height", 9999)
```
> Don't forget to set the width and height.

2. Create an empty selection, ideally selecting the svg elements you intend to update synchronously with data.
```js
const binded_svg = svg.selectAll("rect").data(data)
```
> You need to create an empty selection with `.selectAll("rect")` so that you specify that the data is being binded to the children of the svg, not that you're binding the data to the svg element.

3. Append the choice of svg elements to the binded_svg.
```js
binded_svg.enter().append("rect")
  .attr("x", (_, index) => (i * 200) + 200)
  .attr("y", 250)
  .attr("width", 100) //keep it smaller than x values
  .attr("height", d => d.height) // y axis
  .attr("fill", d => {

}) // y axis
```
> This is for circle
```js
binded_svg.enter().append("circle")
  .attr("cx", (d, i) => (i * 50) + 50)
  .attr("cy", 250)
  .attr("r", (d) => 2 * d.age)
  .attr("fill", d => {
    if (d.name === "Tony") {
      return "blue"
    } else {
      return "red"
    }
  })
```
