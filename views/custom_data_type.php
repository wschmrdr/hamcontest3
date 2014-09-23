<form id='customdatatypeform' name='customdatatypeform'>
    <label for='unique_name' class='long'>Name of Data Field</label>
    <input id='unique_name' type='text' name='unique_name' required/>
    <br/>
    <label for='long_name' class='long'>Long Display Name</label>
    <input id='long_name' type='text' name='long_name' required/>
    <br/>
    <label for='short_name' class='long'>Short Display Name</label>
    <input id='short_name' type='text' name='short_name' required/>
    <br/>
    <label for='data_type' class='long'>Type of Data</label>
    <select id='data_type' name='data_type'>
        <option value=''>Select...</option>
        <option value='number'>Numeric</option>
        <option value='string'>String</option>
        <option value='enum'>String with Dropdown List</option>
    </select>
    <div class='enum_container'></div>
    <br/>
    <label for='max_length' class='long'>Maximum Length</label>
    <input id='max_length' type='text' name='max_length' required/>
    <span>(0 = Unlimited)</span>
    <br/>
    <label for='double_entry' class='long'>Sent and Received</label>
    <input type='checkbox' name='double_entry' value='1'/>
    <br/>
    <label for='sent_data' class='long'>Edit in Sent Data</label>
    <input type='checkbox' name='sent_data' value='1'/>
    <br/>
    <br/>
    <div class="pull-center">
        <input class="btn btn-primary" type="submit" name="datatypebtn" value="OK" />
        <button type="button" class="btn btn-danger modal-input-button cancel-data-type">Cancel</button>
    </div>
</form>
