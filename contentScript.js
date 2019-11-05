var body = document.getElementsByTagName('body')[0];

body.insertAdjacentHTML('afterbegin',`
    <div id="userSearch">
        <form>
            <input type="search" name="search">
        </form>
    </div>
`);