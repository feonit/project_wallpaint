module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	uglify: {
	  options: {
		mangle : true, // false to prevent changes to your variable and function names
		except: ['jQuery', 'Backbone'], //to leave untouched with an except array in the mangle options
		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			  '<%= grunt.template.today("yyyy-mm-dd") %> */'
	  },
	  web: {
		expand: true,
		cwd: 'frontend/src/js/',
		src: '**/*.js',
		dest: 'frontend/web/js/'
	  }
	},
	cssmin: {
		minify: {
			expand: true,
			cwd: 'frontend/src/style/',
			src: ['**/*.css', '!*.min.css'],
			ext: '.css', //'.min.css',
			dest: 'frontend/web/style/'
		}
	  }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('style', ['cssmin:minify']);

};
