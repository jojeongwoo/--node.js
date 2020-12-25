module.exports = {
  HTML: function(title, list, body, link){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${link}
      ${body}
    </body>
    </html>
    `;

  },List: function(result) {
    let list = '<ul>';
    let i = 0;
    while(i < result.length){
      list += `<li><a href="/?id=${result[i].id}">${result[i].title}</a></li>`;
      i += 1;
    }
    list = list+'</ul>';
    return list;

  },authorSelect: function(authors, author_id) {
    let tag = '';
    let i = 0;

    while(i < authors.length) {
      let selected = '';
      if(authors[i].id === author_id) {
        selected = ' selected';
      }
      tag += `<option value = ${authors[i].id}${selected}>${authors[i].name}</option>`;
      i++;
    }
    return `
    <select name = 'author'>
      ${tag}
    </select>
    `

  },authorTable: function(authors) {
      let tag = '<table>';
      let i = 0; 

      while(i < authors.length) {
        tag += 
        `
          <tr>
            <td>${authors[i].name}</td>
            <td>${authors[i].profile}</td>
            <td>
              <form action = '/authors_update' method = 'post'>
                <input type = 'hidden' name = 'id' value = '${authors[i].id}'>
                <input type = 'submit' value = 'update'>
              </form>
            </td>
            <td>
              <form action = '/authors_delete' method = 'post'>
                <input type = 'hidden' name = 'id' value = '${authors[i].id}'>
                <input type = 'submit' value = 'delete'>
              </form>
            </td>
          </tr>
        `
        i++;
      }
      tag += '</table>';
      return tag;
  }
}
