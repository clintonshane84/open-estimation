@extends('layouts.main')
@section('title')
<title>To Do - Manage Tasks</title>
@endsection
@section('styles')
	<link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
	<link href="{{ asset('vendor/alertify/css/alertify.min.css') }}" rel="stylesheet">
	<link href="{{ asset('vendor/alertify/css/themes/bootstrap.rtl.min.css') }}" rel="stylesheet">
	<link href="{{ asset('css/app.css') }}" rel="stylesheet">
	<link href="{{ asset('css/tasks.css') }}" rel="stylesheet">
@endsection
@section('content')
@endsection
@section('scripts')
<div class="content" id="list-app">
    <nav class="navbar navbar-default">
        <div class="navbar-header p-a-1">
          <button type="button" class="btn btn-default" onclick="event.preventDefault(); mytodo.handlers.dialogs.alertify.prompt.open('Label', 'Create New List', function(evt, value){if(value){mytodo.handlers.vue.createList(value)}},function(){mytodo.handlers.dialogs.alertify.error('Cancelled')})"><span class="glyphicon glyphicon-plus-sign m-r-1"></span>New List</button>
        </div>
    </nav>
    <div class="flex-lists">
		<todo-lists :items="lists" :csrf="csrf" :tasks="tasks" :dialog="dialogm" :app="app"></todo-lists>
    </div>
</div>
<div id="modal-edit-task" class="modal">
  <div tabindex="-1" class="modal-win">
    <div role="dialog" aria-modal="true" aria-labelledby="modal-edit-task-title" >
      <header>
		<button class="far fa-window-close pull-right modal-close-btn" type="button" onclick="mytodo.handlers.dialogs.default.close()" aria-label="Close modal">
		</button>
        <h2 id="modal-edit-task-title">
          Edit Task
        </h2>
      </header>

      <div id="modal-edit-task-content" class="modal-content">
        <form id="form-update-task" method="post" enctype="multipart/form-data" class="col-md-12">
    	    <input type="hidden" name="_token" value="@csrf">
    	    <input id="edit-task-input-hidden-id" type="hidden" name="id">
    	    <input id="edit-task-input-hidden-list-id" type="hidden" name="list_id">
			<div class="row p-a-1">
				<div class="col-md-6">
					<div class="row p-t-2">
        				<label>Label</label>
        				<input id="edit-task-input-label" class="p-l-1"></input>
					</div>
					<div class="row p-t-2">
        					<label for="edit-task-input-due-date">Due Date</label>
        					<input id="edit-task-input-due-date" + item.id" type="date" class="form-control">
					</div>
					<div class="row p-t-2">
    						<label for="edit-task-input-priority">Priority</label>
    						<input id="edit-task-input-priority" class="form-control" type="range" min="0" max="9" step="1">
					</div>
				</div>
				<div class="col-md-6">
					<label for="">Description</label>
					<textarea id="edit-task-input-description" rows="8" cols="30"></textarea>
				</div>
				<div class="row pull-right p-t-2">
					<div class="col-md-12">
						<button class="btn btn-danger" type="button" onclick="mytodo.handlers.dialogs.default.close()">Cancel</button>
						<button class="btn btn-success" type="button" onclick="mytodo.handlers.dialogs.default.saveChanges()">Save Changes</button>
					</div>
				</div>
			</form>
      </div>
    </div>
  </div>
</div>
<script>
    window.Laravel = <?php echo json_encode(['csrfToken' => csrf_token()]); ?>
</script>
<script src="{{ asset('vendor/alertify/alertify.min.js') }}" defer></script>
<script src="{{ asset('js/app.js') }}" defer="true"></script>
<script src="{{ asset('js/tasks.js') }}" defer="true"></script>
<script src="{{ asset('js/lists.js') }}" defer="true"></script>
<script src="{{ asset('js/dialog.js') }}" defer="true"></script>
<script src="{{ asset('js/final.js') }}" defer="true"></script>
@endsection