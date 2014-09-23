<form id="customcontestform" name="customcontestform">
    <label for='contest_long_name'>Contest Name</label>
    <input id='contest_long_name' type='text' name='contest_long_name' required/>
    <br/>
    <label for='contest_name'>Cabrillo Name</label>
    <input id='contest_name' type='text' name='contest_name' required/>
    <br/>
    <div id='type_data1_container'></div>
    <div id='type_data2_container'></div>
    <div id='type_data3_container'></div>
    <div id='type_data4_container'></div>
    <div id='type_data5_container'></div>
    <div class='pull-center'>
        <button type="button" class="btn btn-warning modal-input-button custom-data-type">Build Custom Data Type...</button>
    </div>
    <label for='call_loc'>Call After Field</label>
    <span class='custom-radio-input'><input type='radio' name='call_loc' value='0' checked='checked'> First</input></span>
    <span class='custom-radio-input'><input type='radio' name='call_loc' value='1'> 1</input></span>
    <span class='custom-radio-input'><input type='radio' name='call_loc' value='2'> 2</input></span>
    <span class='custom-radio-input'><input type='radio' name='call_loc' value='3'> 3</input></span>
    <span class='custom-radio-input'><input type='radio' name='call_loc' value='4'> 4</input></span>
    <span class='custom-radio-input'><input type='radio' name='call_loc' value='5'> 5</input></span>
    <br/>
    <label for='sect_select_flag'>Change Section?</label>
    <span class='custom-radio-input'><input type='radio' name='sect_select_flag' value='Y'> Yes</input></span>
    <span class='custom-radio-input'><input type='radio' name='sect_select_flag' value='N' checked='checked'> No</input></span>
    <br/>
    <br/>
    <h4>Allow the same call sign with different:</h4>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='freq_dupe_flag' value='Y'> Frequency</input></span>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='mode_dupe_flag' value='Y'> Contact Mode</input></span>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='data1_dupe_flag' value='Y'> Data Field 1</input></span>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='data2_dupe_flag' value='Y'> Data Field 2</input></span>
    <br/>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='data3_dupe_flag' value='Y'> Data Field 3</input></span>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='data4_dupe_flag' value='Y'> Data Field 4</input></span>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='data5_dupe_flag' value='Y'> Data Field 5</input></span>
    <br/>
    <br/>
    <h4>Require the following categories or fixed values:</h4>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='assisted_flag' value='Y'> Assisted</input></span>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='band_flag' value='Y'> Band</input></span>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='mode_flag' value='Y'> Mode</input></span>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='operator_flag' value='Y'> Operator</input></span>
    <br/>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='power_flag' value='Y'> Power</input></span>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='station_flag' value='Y'> Station</input></span>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='time_flag' value='Y'> Time</input></span>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='transmitter_flag' value='Y'> Transmitter</input></span>
    <br/>
    <span class='custom-dupe-checkbox'></span>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='overlay_flag' value='Y'> Overlay</input></span>
    <span class='custom-dupe-checkbox'><input type='checkbox' name='personal_flag' value='Y'> Personal</input></span>
    <br/>
    <br/>
    <label for='score_formula'>Score Formula</label>
    <input id='score_formula' type='text' name='score_formula' required/>
    <button type='button' class='btn btn-warning custom-score-help glyphicon glyphicon-question-sign' data-container='div.modal-body' data-toggle='popover'></button>
    <br/>
    <br/>
    <div class="pull-center">
        <input class="btn btn-primary" type="submit" name="customcontest" value="OK" />
        <button type="button" class="btn btn-danger modal-input-button cancel-custom">Cancel</button>
    </div>
</form>
