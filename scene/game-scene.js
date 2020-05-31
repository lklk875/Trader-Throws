import {tiny, defs} from './common.js';
import {Shape_From_File} from './obj-file-demo.js';
                                            // Pull these names into this module's scope for convenience:
const { vec3, vec4, color, Mat4, Light, Shape, Material, Shader, Texture, Scene } = tiny;
const { Triangle, Square, Tetrahedron, Windmill, Cube, Subdivision_Sphere, Plane, Bin, Shelf, Box, Cake, Stem, Grapes, Slice, Text_Line } = defs

export class Game_Scene extends Scene {
  constructor(context, control_box) // The scene begins by requesting the camera, shapes, and materials it will need.
  {
    super();

     //   picking setup
        this.webgl_manager = context;      // Save off the Webgl_Manager object that created the scene.
        this.scratchpad = document.createElement('canvas');
        this.scratchpad_context = this.scratchpad.getContext('2d');     // A hidden canvas for re-sizing the real canvas to be square.
        this.scratchpad.width   = 256;
        this.scratchpad.height  = 256;
        this.pickingTexture = new Texture ("", false );        // Initial image source: Blank gif file
        this.pickingTexture.image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

    this.shapes = {      
      plane: new defs.Square(),
      cube: new defs.Cube(),
      arc: new defs.Arc(),
      bin: new defs.Bin(),
      ball: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(5),
      can: new defs.Capped_Cylinder( 5, 20, [[0,1],[0,1]] ),
      arizona: new Shape_From_File( "assets/arizona.obj"),
      calpico: new Shape_From_File( "assets/calpico_strawberry.obj"),
      coke: new Shape_From_File( "assets/coca_cola.obj"),
      coconut_water: new Shape_From_File( "assets/coconut_water.obj"),
      starbucks: new Shape_From_File( "assets/starbucks.obj"),
      teapot: new Shape_From_File( "assets/teapot.obj"),
      eaten_apple: new Shape_From_File("assets/eaten_apple.obj"),
      orange: new Shape_From_File("assets/orange.obj"),
      newspaper: new Shape_From_File("assets/newspaper.obj"),
      bananas: new Shape_From_File("assets/bananas.obj"),
      pineapple: new Shape_From_File("assets/pineapple.obj"),
      kleenex_1: new Shape_From_File("assets/kleenex_1.obj"),
      kleenex_2: new Shape_From_File("assets/kleenex_2.obj"),
      pocky: new Shape_From_File("assets/pocky.obj"),
      apple: new Shape_From_File("assets/apple.obj"),
      crayons: new Shape_From_File("assets/crayons.obj"),
      nat_geo_mag_1: new Shape_From_File("assets/nat_geo_mag_1.obj"),
      nat_geo_mag_2: new Shape_From_File("assets/nat_geo_mag_2.obj"),
      nat_geo_mag_3: new Shape_From_File("assets/nat_geo_mag_3.obj"),
      crumpled_paper_1: new Shape_From_File("assets/crumpled_paper_1.obj"),
      crumpled_paper_2: new Shape_From_File("assets/crumpled_paper_2.obj"),
      paper_plane: new Shape_From_File("assets/paper_plane.obj"),
      cashier: new Shape_From_File("assets/cashier.obj"),
      monitor: new Shape_From_File("assets/monitor.obj"),
      shelves: new Shape_From_File("assets/shelves.obj"),
      vending_machine: new Shape_From_File("assets/vending_machine.obj"),

      trash_crate: new Shape_From_File("assets/trash_crate.obj"),
      food_crate: new Shape_From_File("assets/food_crate.obj"),
      home_office_crate: new Shape_From_File("assets/home_office_crate.obj"),
      window: new Shape_From_File("assets/window.obj"),
    
      cat: new Shape_From_File("assets/cat.obj"),
      cat_arm: new Shape_From_File("assets/cat_arm.obj"),

      crate: new Shape_From_File("assets/crate.obj"),

      text:  new defs.Text_Line(24)
    }

    this.sounds = {
                    // background musics
                    bg1: document.getElementById('bg1'),
                    bg2: document.getElementById('bg2'),
                    bg3: document.getElementById('bg3'),
                    challenge_mode1: document.getElementById('challenge_mode1'),
                    challenge_mode2: document.getElementById('challenge_mode2'),
                    gameover_music: document.getElementById('gameoverm'),
                    endgame: document.getElementById('endgame'),

                    //sound effects
                    challenge_warning: document.getElementById('challenge_warning'),
                    correct: document.getElementById('correct'),
                    fail: document.getElementById('fail'),
                    shoot: document.getElementById('shoot'),
                    timecount: document.getElementById('timecount'),
                    timeover_music: document.getElementById('timeover'),
                    win: document.getElementById('win')
                  };

    const bump = new defs.Fake_Bump_Map();
    const phong = new defs.Phong_Shader();
    const texture_phong = new defs.Textured_Phong(1); 

    this.curr_bg = this.sounds.bg1;
    this.curr_sound_effect = this.sounds.shoot;
    this.curr_bg.currentTime = 0;
    this.curr_sound_effect.currentTime = 0;
    this.isplaying = true;

    this.materials = { 

    floor: new Material( phong, { ambient: 1, diffusivity: 1, specularity: .5, color: color( 239/255,222/255,205/255, 1 ) }),
    white_wall: new Material( phong, { ambient: .9, color: color( 1,1,1,1 ) }),
    pink_wall: new Material( phong, { ambient: 1, diffusivity: 1, specularity: .5, color: color( 255/255, 153/255, 204/255, 1 ) }),
    tan_wall: new Material( phong, { ambient: 1, diffusivity: 1, specularity: .5, color: color( 207/255,185/255,161/255,1 ) }),
    glass: new Material( phong, { ambient: .5, diffusivity: 1, specularity: .5, color: color( 60/255, 255/255, 255/255, 0.2  ) }),
    arc: new Material( phong, { ambient: 1, diffusivity: 1, specularity: .5, color: color( 0,0,1,0.5 ) }),
    landscape: new Material( texture_phong,   { color: color( 0,0,0,1 ), ambient: .7, diffusivity: 1, specularity: .9, texture: new Texture( "assets/landscape.jpg" ) }) ,
    bin0: new Material( phong, { ambient: .5, diffusivity: 1, specularity: .5, color: color( 60/255, 255/255, 255/255, 0 ) }),
    bin1: new Material( phong, { ambient: .5, diffusivity: 1, specularity: .5, color: color( 100/255, 100/255, 100/255, 0 ) }),
    bin2: new Material( phong, { ambient: .5, diffusivity: 1, specularity: .5, color: color( 255/255, 100/255, 200/255, 0 ) }),
    shadow: new Material( new defs.Shadow_Shader(), { ambient: 1, diffusivity: 0, specularity: 0, color: color(254/255,214/255,214/255,1) }),
    
    
    shelves: new Material( bump,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/shelves.png" ) }) ,
    arizona: new Material( bump,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/arizona.png" ) }) ,
    calpico: new Material( bump,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/calpico_strawberry.png" ) }) ,
    coke: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/coca_cola.png" ) }) ,
    coconut_water: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: 1, texture: new Texture( "assets/coconut_water.png" ) }) ,
    starbucks: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: 0, texture: new Texture( "assets/starbucks.png" ) }) ,
    chocolate: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/chocolate.jpg" ) }) ,    
    eaten_apple: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .1, texture: new Texture( "assets/eaten_apple.png" ) }) ,    
    orange: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/orange.png" ) }) ,    
    newspaper: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0, texture: new Texture( "assets/newspaper.png" ) }) ,    
    bananas: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0.3, texture: new Texture( "assets/bananas.png" ) }) ,    
    pineapple: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0.3, texture: new Texture( "assets/pineapple.png" ) }) ,    
    kleenex_1: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0.5, texture: new Texture( "assets/kleenex_1.png" ) }) ,    
    kleenex_2: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0.5, texture: new Texture( "assets/kleenex_2.png" ) }) ,    
    baseball: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0.3, texture: new Texture( "assets/baseball.jpg" ) }) ,    
    pocky: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0.8, texture: new Texture( "assets/pocky.png" ) }) ,    
    apple: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0.8, texture: new Texture( "assets/apple.png" ) }) ,    
    crayons: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0.5, texture: new Texture( "assets/crayons.png" ) }) ,    
    magic8ball: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 1, texture: new Texture( "assets/magic8ball.jpg" ) }) ,    
    nat_geo_mag_1: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0.5, texture: new Texture( "assets/nat_geo_mag_1.png" ) }) ,    
    nat_geo_mag_2: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0.5, texture: new Texture( "assets/nat_geo_mag_2.png" ) }) ,    
    nat_geo_mag_3: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0.5, texture: new Texture( "assets/nat_geo_mag_3.png" ) }) ,    
    crumpled_paper_1: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0.5, texture: new Texture( "assets/crumpled_paper_1.png" ) }) ,    
    crumpled_paper_2: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0.5, texture: new Texture( "assets/crumpled_paper_2.png" ) }) ,    
    paper_plane: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0, texture: new Texture( "assets/paper_plane.png" ) }) ,    
    back_wall: new Material( texture_phong,   { color: color( 0,0,0,1 ), ambient: 1, diffusivity: 1, specularity: 0, texture: new Texture( "assets/window.png" ) }),


    floor_tile: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: .5, diffusivity: .5, specularity: 1, texture: new Texture( "assets/floor_tile.png" ) }), 
    floor_tile_bump_map: new Material( texture_phong,  { color: color( 232/255,184/255,135/255,1 ), ambient: .6, diffusivity: 1, specularity: .5, texture: new Texture( "assets/floor_tile_bump_map.png" ) }), 
    cashier: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/cashier.png" ) }), 
    monitor_1: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_1.png" ) }), 
    monitor_2: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_2.png" ) }), 
    monitor_3: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_3.png" ) }), 
    monitor_4: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_4.png" ) }), 
    monitor_5: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_5.png" ) }), 
    monitor_6: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_6.png" ) }), 
    monitor_7: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_7.png" ) }), 
    monitor_8: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_8.png" ) }), 
    monitor_9: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_9.png" ) }), 
    monitor_10: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_10.png" ) }), 
    monitor_11: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_11.png" ) }), 
    monitor_12: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_12.png" ) }), 
    monitor_13: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_13.png" ) }), 
    monitor_14: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_14.png" ) }), 
    monitor_15: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_15.png" ) }), 
    monitor_16: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_16.png" ) }), 
    monitor_17: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_17.png" ) }), 
    monitor_18: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_18.png" ) }), 
    monitor_19: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_19.png" ) }), 
    monitor_20: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_20.png" ) }), 
    monitor_21: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_21.png" ) }), 
    monitor_22: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_22.png" ) }), 
    monitor_23: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_23.png" ) }), 
    monitor_24: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/monitor_24.png" ) }),     
    window: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/window.png" ) }),     
    vending_machine: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/vending_machine.png" ) }),     
    
    cat: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/cat.png" ) }),     
    cat_arm: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/cat_arm.png" ) }),     

    trash_crate: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/trash_crate.png" ) }), 
    food_crate: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/food_crate.png" ) }), 
    home_office_crate: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/home_office_crate.png" ) }), 

    crate: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/crate.png" ) }), 

    text_image: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 0.8, diffusivity: .5, specularity: .5, texture: new Texture( "assets/text.png" ) }) ,    
    girl_throws: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/girl_throws.png" ) }) ,
    trader_throws_logo: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/trader_throws_logo.png" ) }), 
    intro_text: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/intro_text.png" ) }), 
    intro_start: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/intro_start.png" ) }), 
    girl_sad: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/girl_sad.png" ) }), 
    girl_happy: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/girl_happy.png" ) }), 
    end_restart: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/end_restart.png" ) }), 
    end_lose: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/end_lose.png" ) }), 
    end_win: new Material( texture_phong,  { color: color( 0,0,0,1 ), ambient: 1, diffusivity: .5, specularity: .5, texture: new Texture( "assets/end_win.png" ) }), 
    }

    /* BIN KEY */
    // 0 ==> food
    // 1 ==> non-food groceries
    // 2 ==> trash

    /* PROJECTILE KEY */
    // 0 ==> kleenex 2  
    // 1 ==> pocky
    // 2 ==> orange 
    // 3 ==> nat geo mag 1
    // 4 ==> magic 8 ball 
    // 5 ==> pineapple
    // 6 ==> crumpled paper 1
    // 7 ==> newspaper
    // 8 ==> coca cola 
    // 9 ==> eaten apple
    // 10 ==> bananas 
    // 11 ==> kleenex 1
    // 12 ==> chocolate 
    // 13 ==> used starbucks cup
    // 14 ==> apple
    // 15 ==> calpico 
    // 16 ==> coconut water 
    // 17 ==> baseball
    // 18 ==> nat geo mag 3
    // 19 ==> arizona tea  
    // 20 ==> crayons
    // 21 ==> paper airplane
    // 22 ==> nat geo mag 2
    // 23 ==> crumpled paper 2

    this.type = 0;
//     this.type = Math.floor(Math.random()*6);


    this.game_start = false;
    this.game_end = false;
    this.game_over = false;

   // this.state = this.states.startScreen;
    
    //total score
    this.score = 0.0;
    window.ready = false;
    this.finalScore = 0.0;
    this.life = 5.0;
    this.correct_bin;
    this.penalized = false;
  
    //determines if we begin trajectory calcuation
    this.throw = false;
    //projectile time
    this.ball_t = 0;
    //projectile opacity
    this.ball_op = 1;
    //determines rebound calculation
    this.bounce_left = false;
    this.bounce_right = false;
    this.bounce_up_right = false;
    this.bounce_up_left = false;
    //projectile mid-air rotation
    this.spin_x = Math.floor(Math.random()*4)-2;
    this.spin_y = Math.floor(Math.random()*4)-2;
    this.spin_z = Math.floor(Math.random()*4)-2;
    //projectile initial conditions
    this.ball_angle_init = 0;
    this.ball_x = 0;
    this.ball_y = 1;
    this.ball_z = 0;
    this.ball_scale = 1;
    this.ball_scale_z = 1;
    this.bounce_time;
    this.first_bounce = true;
    this.scored = false;

    this.monitor_t = 0;
    this.game_intro = true;
    window.pan = false;
    window.ready = false;
    //for collision detection with bins 
    this.bin_y_max = 9.3;
    this.bin_y_min = -0.1;
    this.bin1_z_max_og = -23;
    this.bin1_z_min_og = -30;
    this.bin0_z_max_og = -32;
    this.bin0_z_min_og = -34;
    this.bin2_z_max_og = -33;
    this.bin2_z_min_og = -35;
    this.bin0_z_max = -32;
    this.bin0_z_min = -34;
    this.bin1_z_max = -23;
    this.bin1_z_min = -30;
    this.bin2_z_max = -33;
    this.bin2_z_min = -35;
    //for challenge mode
    this.challenge = false;
    this.song_t = 0;
    this.bin0_t = 0;
    this.bin1_t = 0;
    this.bin2_t = 0;
    this.bin1_steps = 0;
    this.bin1_forward = false;
    this.bin0_steps = 0;
    this.bin1_steps = 0;
    this.bin2_steps = 0;
    this.bin0_forward = false;
    this.bin2_steps = 0;
    this.bin2_forward = false;
    this.failed = false;
    this.program_state;


    //all environment box information 
//     this.boxCount = Math.ceil(Math.random() * 10);
    this.boxes = [];

    this.itemPos = [];
    this.items = [];
    this.scatter();

//     this.boxes = this.set_boxes(); 
    this.lights = [new Light( vec4(-100,100,0, 0), color( 1,1,1,1 ), 100000)]; 

  }


  make_control_panel() // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
  {
    this.key_triggered_button("throw", ["t"], ()=>{ if (!this.throw && this.ball_op >= 1) { this.throw = !this.throw;
                                                                                            this.reset_se();
                                                                                            this.curr_sound_effect = this.sounds.shoot;
                                                                                            this.curr_sound_effect.load(); 
                                                                                            this.curr_sound_effect.play(); 
                                                                                              
                                                                                          }
                                                                                        });
    this.key_triggered_button("turn left", ["a"], ()=>{ if (this.ball_angle_init > -10 && !this.throw) { this.ball_angle_init += .05; }});
    this.key_triggered_button("turn right", ["d"], ()=>{ if (this.ball_angle_init < 10 && !this.throw) { this.ball_angle_init -= .05; }});
    this.key_triggered_button( "normal view", [ "5" ], ()=> { window.lookat_desk = false;
                                                              window.lookat_cat = false; 
                                                              window.ready = true;
                                                              window.pan = false;
                                                              this.game_intro = false; 
                                                              this.program_state.set_camera( Mat4.translation( -1,-8,-25 )); 
                                                              this.end_seq_t = this.t;
                                                              this.reset_se(); });  
                                                              

    this.key_triggered_button( "change music", [ "0" ], () => {          
                                                                                


                                                                                if(this.curr_bg == this.sounds.bg1)
                                                                                {
                                                                                  this.reset_bg();
                                                                                  this.curr_bg = this.sounds.bg2;
                                                                                  this.curr_bg.load();
                                                                                  this.curr_bg.play();
                                                                                  this.curr_bg.loop = true;
                                                                                }
                                                                                else if (this.curr_bg == this.sounds.bg2)
                                                                                {
                                                                                  this.reset_bg();                                                                          
                                                                                  this.curr_bg = this.sounds.bg3;
                                                                                  this.curr_bg.load();
                                                                                  this.curr_bg.play();
                                                                                  this.curr_bg.loop = true;
                                                                                }
                                                                                else if (this.curr_bg == this.sounds.bg3)
                                                                                {       
                                                                                  this.reset_bg();                                                                        
                                                                                  this.curr_bg = this.sounds.bg1;
                                                                                  this.curr_bg.load();
                                                                                  this.curr_bg.play();
                                                                                  this.curr_bg.loop = true;
                                                                                }

                                                                                if(this.challenge == true)
                                                                                {
                                                                                  if (this.curr_bg == this.sounds.challenge_mode2)
                                                                                  {           
                                                                                    this.reset_bg();                                                                   
                                                                                    this.curr_bg = this.sounds.challenge_mode1;
                                                                                    this.curr_bg.load();
                                                                                    this.curr_bg.play();
                                                                                    this.curr_bg.loop = true;
                                                                                  }


                                                                                  else if (this.curr_bg == this.sounds.challenge_mode1)
                                                                                  {                
                                                                                    this.reset_bg();                                                                
                                                                                    this.curr_bg = this.sounds.challenge_mode2;
                                                                                    this.curr_bg.load();
                                                                                    this.curr_bg.play();
                                                                                    this.curr_bg.loop = true;
                                                                                  }
                                                                              } 
                                                                           // }
                                                                          });
                                                                          
    this.key_triggered_button( "challenge mode",           [ "c" ], () => {  
                                                                            this.challenge = true; 
                                                                            this.reset_bg();
                                                                            this.reset_se();        

                                                                            this.curr_sound_effect = this.sounds.challenge_warning;
                                                                            this.curr_sound_effect.load(); 
                                                                            this.curr_sound_effect.play(); 
                                                                            this.curr_bg = this.sounds.challenge_mode1;
                                                                            this.curr_bg.load(); 
                                                                            this.curr_bg.play();
                                                                            this.curr_bg.loop = true;
                                                                          } );
   
    this.key_triggered_button( "normal mode",           [ "n" ], () => {
                                                                          this.challenge = false;
                                                                          this.reset_bg();
                                                                            if(this.curr_bg == this.sounds.challenge_mode1 || this.curr_bg == this.sounds.challenge_mode2)
                                                                            {                
                                                                              this.curr_bg = this.sounds.bg1;                                                            
                                                                              this.curr_bg.load();
                                                                              this.curr_bg.play();
                                                                              this.curr_bg.loop = true;
                                                                            }                       
                                                                        
                                                                       } );

    this.key_triggered_button( "start game",           [ "s" ], () => {   this.game_intro = false;
                                                                            window.pan = true; 
                                                                           window.ready = false;
                                                                           window.lookat_desk = false;
                                                                           window.lookat_cat = false;
                                                                           this.timeover = false;
                                                                          this.start_seq_t = this.t; 
                                                                          this.life = 5;
                                                                          this.time = 0;
                                                                          this.score = 0;
                                                                          this.game_over = false;
                                                                          this.game_end = false; 
                                                                          this.reset_bg();
                                                                          this.curr_bg = this.sounds.bg1;
                                                                          this.curr_bg.load();
                                                                          this.curr_bg.play(); 
                                                                          this.curr_bg.loop = true;
                                                                       } );
   }


  in_bin(bin_num, ball_y, ball_z) {
    let correct_x = false;
    let z_max, z_min, stage;
    let x_temp = this.ball_x + this.ball_x_init + this.ball_x_roll;
    switch(bin_num) {
      case 0: 
        if (this.ball_angle_init >= .39 && this.ball_angle_init <= .56) { correct_x = true; }
        z_max = this.bin0_z_max;
        z_min = this.bin0_z_min;
        break;
      case 1: 
        if (this.ball_angle_init >= -.09 && this.ball_angle_init <= .09) { correct_x = true; }
        z_max = this.bin1_z_max;
        z_min = this.bin1_z_min;
        break;
      case 2: 
        if (this.ball_angle_init >= -.56 && this.ball_angle_init <= -.39) { correct_x = true; }
        z_max = this.bin2_z_max;
        z_min = this.bin2_z_min;
        break;
    } 
    if (!this.scored && ball_z <= z_max && ball_z >= z_min && this.ball_y <= this.bin_y_max && correct_x) 
    {   
          if (this.challenge)
          {
            this.score += 2;
            this.scored = true;
            this.reset_se();
            this.curr_sound_effect = this.sounds.correct;
            this.curr_sound_effect.load();
            this.curr_sound_effect.play();
            
             //play game ending sounds

            if(!this.game_over && this.time < 60 && this.score >= 30)// this.score should be >= 30, I set this.score >= 3 for demo
            {
              this.game_end = true;
              this.reset_se();
              this.reset_bg();
              this.curr_bg = this.sounds.endgame;
              this.curr_sound_effect = this.sounds.win;
              this.curr_bg.load();
              this.curr_bg.play();
              this.curr_sound_effect.load();
              this.curr_sound_effect.play();
            }
            return true;
          }

          else
          {
            this.score += 1;
            this.scored = true;
            this.reset_se();
            this.curr_sound_effect = this.sounds.correct;
            this.curr_sound_effect.load();
            this.curr_sound_effect.play();

            //play game ending sounds
            if(!this.game_over && this.time < 60 && this.life > 0 && this.score >= 30)// this.score should be >= 30, I set this.score >= 3 for demo
            {
              this.game_end = true;
              this.reset_se();
              this.reset_bg();
              this.curr_bg = this.sounds.endgame;
              this.curr_sound_effect = this.sounds.win;
              this.curr_bg.load();
              this.curr_bg.play();
              this.curr_sound_effect.load();
              this.curr_sound_effect.play();
            }
            return true;
          }
    }
    else if (!correct_x && ball_z < -20 && ball_y < .1 && !this.penalized && this.life > 0) 
    {
        if(this.challenge == false)
          this.life -= 1;
          this.penalized = true;
          this.reset_se();
          this.curr_sound_effect = this.sounds.fail;
          this.curr_sound_effect.load();
          this.curr_sound_effect.play();

        return false;
    }

    if(this.life == 0)
    {

      this.reset_se();
      this.reset_bg();
      var game_overmusic  = this.sounds.gameover_music;
      game_overmusic.play();
      game_overmusic = null;
      this.game_over = true;
    }
  }

  display( context, program_state ) 
  { 
    this.program_state = program_state;

    this.t = program_state.animation_time
    const dt = program_state.animation_delta_time;
    let seconds = (this.t - this.start_seq_t) / 1000 + 10; 
    const dseconds = dt / 1000;
                      
    if( !context.scratchpad.controls ) { 
        this.children.push( context.scratchpad.controls = new defs.Movement_Controls() ); 
        program_state.set_camera( Mat4.translation( -1,-8,-25 ) );    // Locate the camera here (inverted matrix).
    }

    //mouse picking: if click on the "1" cashier sign, zoom into cashier desk
    if (window.ready && window.lookat_desk) { 
        program_state.set_camera(Mat4.translation(-10,-12,32)); 
        window.lookat_cat = false; 
    }

    else if (window.ready && window.lookat_cat) { 
        program_state.set_camera(Mat4.translation(-29,-16,50));
        window.lookat_desk = false; 
    }


//     /*********** CAMERA PAN MOTION ***********
      //Start with "hard-coded" scenes that are there regardless 
    //if (this.states.startScreen)
    let camera_matrix =Mat4.rotation(Math.PI, 0, 1, 0).times( Mat4.translation(-1, -8, -20));
    if (this.game_intro) {
       program_state.set_camera( Mat4.translation(0, 0, 50).times(Mat4.rotation(Math.PI, 0, 1, 0)) );
    }
//     if (this.states.play) -> let all the following cutscenes proceed 
//     intro scene 2: Around store 
    camera_matrix = Mat4.rotation((seconds)/5, 0, 1, 0).times(camera_matrix);
    if (window.pan && seconds >= 10 && seconds < 20) 
       program_state.set_camera(camera_matrix);

    //intro scene 4: vending_machine, cat
    seconds += 10;
//     camera_matrix = Mat4.translation( 0.5* (seconds - 20), -15, 25).times(Mat4.rotation(Math.PI/16, 1, 0, 0).times(Mat4.rotation(Math.PI/6, 0, 1, 0)).times(Mat4.scale(1/2, 1/2, 1/2)) ); 
// //     camera_matrix = Mat4.translation(-3 * (seconds - 10), -20, -5).times(Mat4.rotation(Math.PI/10, 1, 0, 0).times(Mat4.rotation(Math.PI/-2, 0, 1, 0)) ); 
//     if (this.game_pan && seconds >= 20 && seconds < 30)
//        program_state.set_camera( camera_matrix );

    //intro scene 4: RIGHT side of store 
    camera_matrix = Mat4.translation( 3 * (seconds - 27), -15, 5).times(Mat4.rotation(Math.PI/16, 1, 0, 0).times(Mat4.rotation(Math.PI/2, 0, 1, 0)) ); 
    if (window.pan && seconds >= 30 && seconds < 40)
       program_state.set_camera( camera_matrix );

    //intro scene 5: BACK shelves, cash register 
    if (window.pan && seconds >= 40 && seconds < 50)
       program_state.set_camera( Mat4.translation(-1 * (seconds - 40), -30, 30).times(Mat4.rotation( Math.PI/10, 1, 0, 0)) );
//        program_state.set_camera( Mat4.translation(-1 * (seconds - 40), -10, 32) );//.times(Mat4.rotation(Math.PI/5, 1, 0, 0)) )

    //camera_matrix = Mat4.translation((11/10)*(seconds - 30), 0, -5.5*(seconds-30)).times(camera_matrix); 
    //intro scene 3: Boxes 
    if (window.pan && seconds >= 50 && seconds < 60)
       program_state.set_camera( Mat4.translation(-1 * (seconds - 80), -35, 5).times(Mat4.rotation( Math.PI/5, 1, 0, 0)).times(Mat4.rotation( Math.PI/15, 0, 1, 0)) );//.times(Mat4.rotation( Math.PI/10, 1, 0, 0)) );

    //intro scene 4: panning to starting point
    if (window.pan && seconds >= 60 && seconds < 70) 
       program_state.set_camera( Mat4.translation(-1, -8, 35 - 6 * (seconds - 60)) ); 
   
//     if (this.states.gameOver)
    if (this.game_end || this.game_over) 
    {
        program_state.set_camera( Mat4.translation(0, 0, 50).times(Mat4.rotation(Math.PI, 0, 1, 0)) );
    }
    
    if (seconds > 70 && window.pan) { 
        window.ready = true;
        window.pan = false;
        this.end_seq_t = this.t;
     }


// ****************** END CAMERA PAN SECTION ******************/


    program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 500 );
    program_state.lights = [ new Light( vec4(-100,100,0, 0), color( 1,1,1,1 ), 100000) ];

    
    if (this.challenge) {
        program_state.lights = [new Light(Mat4.rotation(0.001*Math.PI*this.t, 0,1,1).times(vec4(0,20,-10,1)), color(255/255,242/255,112/255,1), 100),
                                new Light(Mat4.rotation(0.001*Math.PI*this.t, 1,0,1).times(vec4(10,0,-20,1)), color(1,0,0,1), 100),
                                new Light(Mat4.rotation(0.001*Math.PI*this.t, 1,1,1).times(vec4(-10,0,-20,1)), color(0,0,1,1), 100) ];
    }

    let tr_intro_pink = Mat4.identity();
    tr_intro_pink = tr_intro_pink.times(Mat4.translation(0,0,170));
    tr_intro_pink = tr_intro_pink.times(Mat4.scale(100,50,0));

    let tr_intro_white = Mat4.identity();
    tr_intro_white = tr_intro_white.times(Mat4.rotation(Math.PI/12, 0,0,1));
    tr_intro_white = tr_intro_white.times(Mat4.translation(-12,0,75));
    tr_intro_white = tr_intro_white.times(Mat4.scale(10,20,0));
    
    let tr_intro_logo = Mat4.identity();
    tr_intro_logo = tr_intro_logo.times(Mat4.translation(-10.5,5.7,73));
    tr_intro_logo = tr_intro_logo.times(Mat4.rotation(Math.PI, 0,1,0));
    tr_intro_logo = tr_intro_logo.times(Mat4.scale(6,6,0));

    let tr_intro_text = Mat4.identity();
    tr_intro_text = tr_intro_text.times(Mat4.translation(-10,-1.5,73));
    tr_intro_text = tr_intro_text.times(Mat4.rotation(Math.PI, 0,1,0));
    tr_intro_text = tr_intro_text.times(Mat4.scale(7,7,0));

    let tr_intro_start = Mat4.identity();
    tr_intro_start = tr_intro_start.times(Mat4.translation(-8,-9+0.2*Math.sin(2*this.t/1000),73));
    tr_intro_start = tr_intro_start.times(Mat4.rotation(Math.PI, 0,1,0));
    tr_intro_start = tr_intro_start.times(Mat4.scale(7,7,0));

    let tr_intro_girl = Mat4.identity();
    tr_intro_girl = tr_intro_girl.times(Mat4.rotation(0.04*Math.sin(this.t/1000), 0,0,1));
    tr_intro_girl = tr_intro_girl.times(Mat4.translation(9.8,-2.8,75));
    tr_intro_girl = tr_intro_girl.times(Mat4.scale(9.5,9.5,0));

    let tr_intro_pocky = Mat4.identity();
    tr_intro_pocky = tr_intro_pocky.times(Mat4.translation(15.2,4.8+0.2*Math.sin(2*this.t/1000),75));
    tr_intro_pocky = tr_intro_pocky.times(Mat4.rotation(-Math.PI/6, 0,0,1));
    tr_intro_pocky = tr_intro_pocky.times(Mat4.rotation(0.8*Math.PI*this.t/1000, 0,1,0));
    tr_intro_pocky = tr_intro_pocky.times(Mat4.scale(3/2,3/2,3/2));

    let tr_intro_coconut_water = Mat4.identity();
    tr_intro_coconut_water = tr_intro_coconut_water.times(Mat4.translation(10,5+0.2*Math.sin(2*this.t/1000),75));
    tr_intro_coconut_water = tr_intro_coconut_water.times(Mat4.rotation(Math.PI/12, 0,0,1));
    tr_intro_coconut_water = tr_intro_coconut_water.times(Mat4.rotation(-0.8*Math.PI*this.t/1000, 0,1,0));
    tr_intro_coconut_water = tr_intro_coconut_water.times(Mat4.scale(4/5,4/5,4/5));

    let tr_intro_natgeo = Mat4.identity();
    tr_intro_natgeo = tr_intro_natgeo.times(Mat4.translation(12.5,7.5+0.2*Math.sin(2*this.t/1000),75));
    tr_intro_natgeo = tr_intro_natgeo.times(Mat4.rotation(-Math.PI/2, 0,0,1));
    tr_intro_natgeo = tr_intro_natgeo.times(Mat4.rotation(-0.8*Math.PI*this.t/1000, 1,0,0));
    tr_intro_natgeo = tr_intro_natgeo.times(Mat4.scale(2.2,2.2,2.2));

    let tr_desk_fan = Mat4.identity();
    tr_desk_fan = tr_desk_fan.times(Mat4.translation(0,5,0));

    let tr_desk_apple = Mat4.identity();

    let tr_end_text = Mat4.identity();
    tr_end_text = tr_end_text.times(Mat4.translation(-10,0,73));
    tr_end_text = tr_end_text.times(Mat4.rotation(Math.PI, 0,1,0));
    tr_end_text = tr_end_text.times(Mat4.scale(7,7,0));

    let tr_end_girl = Mat4.identity();
    tr_end_girl = tr_end_girl.times(Mat4.rotation(0.04*Math.sin(this.t/1000), 0,0,1));
    tr_end_girl = tr_end_girl.times(Mat4.translation(9.8,-1,75));
    tr_end_girl = tr_end_girl.times(Mat4.scale(8,8,0));

    let tr_end_cat = Mat4.identity(); 
    tr_end_cat = tr_end_cat.times(Mat4.rotation(0.04*Math.sin(this.t/1000), 0,0,1));
    tr_end_cat = tr_end_cat.times(Mat4.translation(10,-1,75));
    tr_end_cat = tr_end_cat.times(Mat4.rotation(Math.PI/1.5, 0, 1, 0))
    tr_end_cat = tr_end_cat.times(Mat4.scale(5, 5, 5));

    let tr_end_cat_arm = (tr_end_cat);
    tr_end_cat_arm = Mat4.translation(-5.5, 1, 3).times(tr_end_cat_arm);
    tr_end_cat_arm = tr_end_cat_arm.times(Mat4.translation(0, -1/4, 0));
    tr_end_cat_arm = tr_end_cat_arm.times(Mat4.rotation(Math.PI/4*Math.sin(this.t/400) - Math.PI/6, 0, 0, 1));
    tr_end_cat_arm = tr_end_cat_arm.times(Mat4.translation(0, 1/4, 0));
    tr_end_cat_arm = tr_end_cat_arm.times(Mat4.scale(1/2, 1/2, 1/2));

    let tr_floor = Mat4.identity();
    tr_floor = tr_floor.times(Mat4.rotation(Math.PI/2, 1,0,0));
    tr_floor = tr_floor.times(Mat4.scale(100, 100, 0));
    tr_floor = tr_floor.times(Mat4.translation(0,-0.5,0));

    let tr_light_1 = Mat4.identity();
    tr_light_1 = tr_light_1.times(Mat4.translation(0,20,-10));
    tr_light_1 = tr_light_1.times(Mat4.scale(.5, .5, .5));


    let tr_backdrop = Mat4.identity();
    tr_backdrop = tr_backdrop.times(Mat4.translation(190,60,-250));
    tr_backdrop = tr_backdrop.times(Mat4.scale(90,90,0));

    let tr_back_wall = Mat4.identity();
    tr_back_wall = tr_back_wall.times(Mat4.translation(0,50,-80));
    tr_back_wall = tr_back_wall.times(Mat4.scale(100,50,0));

    let tr_left_wall = Mat4.identity();
    tr_left_wall = tr_left_wall.times(Mat4.rotation(Math.PI/2, 0,1,0));
    tr_left_wall = tr_left_wall.times(Mat4.translation(50,50,-100));
    tr_left_wall = tr_left_wall.times(Mat4.scale(100,50,0));

    let tr_left_door = Mat4.identity();
    tr_left_door = tr_left_door.times(Mat4.rotation(Math.PI/2, 0,1,0));
    tr_left_door = tr_left_door.times(Mat4.translation(50,50,50));
    tr_left_door = tr_left_door.times(Mat4.scale(100,50,0));

    this.tr_bin1 = Mat4.identity();
    this.tr_bin1 = this.tr_bin1.times(Mat4.scale(3, 4, 3));
    this.tr_bin1 = this.tr_bin1.times(Mat4.translation(0, 1, -10));

    this.tr_bin0 = this.tr_bin1.times(Mat4.translation(-5, 0, 0));
    this.tr_bin2 = this.tr_bin1.times(Mat4.translation(5, 0, 0));


    let tr_bin1_shadow = Mat4.identity();
    tr_bin1_shadow = tr_bin1_shadow.times(Mat4.scale(3, 0.01, 3.5));
    tr_bin1_shadow = tr_bin1_shadow.times(Mat4.translation(0, 1.05, -10.4));
    tr_bin1_shadow = tr_bin1_shadow.times(Mat4.rotation(-Math.PI/2, 0,1,0));
    tr_bin1_shadow = tr_bin1_shadow.times(Mat4.scale(1.5, 1, 1.5));
    tr_bin1_shadow = tr_bin1_shadow.times(Mat4.translation(-.3, 0, 0));
    tr_bin1_shadow = tr_bin1_shadow.times(Mat4.scale(1.05, 1, 1));

    let tr_bin0_shadow = Mat4.identity();
    tr_bin0_shadow = tr_bin0_shadow.times(Mat4.translation(-17.6, 0.01, -32));
    tr_bin0_shadow = tr_bin0_shadow.times(Mat4.rotation(-Math.PI/3, 0,1,0));
    tr_bin0_shadow = tr_bin0_shadow.times(Mat4.scale(7, 0.01, 5));


    let tr_bin2_shadow = Mat4.identity();
    tr_bin2_shadow = tr_bin2_shadow.times(Mat4.translation(17.6, 0.01, -32));
    tr_bin2_shadow = tr_bin2_shadow.times(Mat4.rotation(4*Math.PI/3, 0,1,0));
    tr_bin2_shadow = tr_bin2_shadow.times(Mat4.scale(7, 0.01, 5));



    if (this.challenge) {
            tr_bin1_shadow = tr_bin1_shadow.times(Mat4.translation(this.bin1_steps+1, 0, 0));
            tr_bin2_shadow = tr_bin2_shadow.times(Mat4.shear(-1));
            tr_bin2_shadow = tr_bin2_shadow.times(Mat4.translation(this.bin2_steps+1, 0, 0));
            tr_bin2_shadow = tr_bin2_shadow.times(Mat4.shear(1));
            tr_bin0_shadow = tr_bin0_shadow.times(Mat4.shear(1));
            tr_bin0_shadow = tr_bin0_shadow.times(Mat4.translation(this.bin0_steps+1, 0, 0));
            tr_bin0_shadow = tr_bin0_shadow.times(Mat4.shear(-1));
    }

    let tr_cashier = Mat4.identity();
    tr_cashier = tr_cashier.times(Mat4.translation(10,12.5,-65));
    tr_cashier = tr_cashier.times(Mat4.rotation(-Math.PI/2, 0,1,0));
    tr_cashier = tr_cashier.times(Mat4.scale(4,4,4));

    let tr_monitor = Mat4.identity();
    tr_monitor = tr_monitor.times(Mat4.translation(18,12.3,-65));
    tr_monitor = tr_monitor.times(Mat4.rotation(-Math.PI/3, 0,1,0));
    tr_monitor = tr_monitor.times(Mat4.scale(2,2,2));


    let tr_arc = Mat4.identity();
    tr_arc = tr_arc.times(Mat4.rotation(this.ball_angle_init, 0,1,0));
    tr_arc = tr_arc.times(Mat4.translation(0,4,-16));
    tr_arc = tr_arc.times(Mat4.rotation(Math.PI/2, 0,1,0));
    tr_arc = tr_arc.times(Mat4.scale(16,12,2));

    let tr_ball = Mat4.identity();
    tr_ball = tr_ball.times(Mat4.rotation(this.ball_angle_init, 0,1,0));
    tr_ball = tr_ball.times(Mat4.translation(0,2.1,0));

    switch(this.type) {
      case 0: //kleenex 2
        tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/2, 0,1,0));
        tr_ball = tr_ball.times(Mat4.translation(0,-.4,0));
        tr_ball = tr_ball.times(Mat4.scale(2/3,2/3,2/3));
        this.ball_scale = 2/3;
        this.correct_bin = 1;
        break;
      case 1: //pocky
        tr_ball = tr_ball.times(Mat4.rotation(Math.PI/4, 0,1,0));
        tr_ball = tr_ball.times(Mat4.translation(0,-1.25,0));
        this.correct_bin = 0;
        break;
      case 2: //orange
        tr_ball = tr_ball.times(Mat4.translation(0,-1.5,0));
        tr_ball = tr_ball.times(Mat4.scale(0.5,0.5,0.5));
        this.ball_scale = 0.5;
        this.correct_bin = 0;
        break;
      case 3: //nat geo mag 1
        tr_ball = tr_ball.times(Mat4.translation(0,-2,0));
        tr_ball = tr_ball.times(Mat4.scale(3/2,3/2,3/2));
        this.ball_scale = 3/2;
        this.correct_bin = 1;
        break;
      case 4: //magic 8 ball 
        tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/2, 0,1,0));
        tr_ball = tr_ball.times(Mat4.translation(0,-1.7,0));
        tr_ball = tr_ball.times(Mat4.scale(2/5,2/5,2/5)); 
        this.ball_scale = 2/5;
        this.correct_bin = 1;
        break;
      case 5: //pineapple
        this.correct_bin = 0;
        tr_ball = tr_ball.times(Mat4.translation(0,0.9,0));
        tr_ball = tr_ball.times(Mat4.scale(2/3,3/4,2/3));
        this.ball_scale = 2/3;
        break;
      case 6: //crumpled paper 1
        tr_ball = tr_ball.times(Mat4.translation(0,-1.2,0));
        tr_ball = tr_ball.times(Mat4.scale(2/3,2/3,2/3));
        this.ball_sacle = 2/3;
        this.correct_bin = 2;
        break;
      case 7: //newspaper
        tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/2, 0,1,0));
        tr_ball = tr_ball.times(Mat4.translation(0,-1.9,0));
        tr_ball = tr_ball.times(Mat4.scale(4/3,4/3,4/3));
        this.ball_scale = 4/3;
        this.correct_bin = 1;
        break;
      case 8: //coca cola
        tr_ball = tr_ball.times(Mat4.translation(0,0.2,0));
        tr_ball = tr_ball.times(Mat4.scale(3/4,3/4,3/4));
        this.ball_scale = 3/4;
        this.correct_bin = 0;
        break;
      case 9: //eaten apple
        tr_ball = tr_ball.times(Mat4.translation(0,-1.25,0));
        tr_ball = tr_ball.times(Mat4.scale(0.5,0.5,0.5));
        this.ball_scale = 0.5;
        this.correct_bin = 2;
        break;
      case 10: //bananas
        tr_ball = tr_ball.times(Mat4.translation(0,-1,0));
        tr_ball = tr_ball.times(Mat4.scale(3/4,3/4,3/4));
        this.ball_scale = 3/4;
        this.correct_bin = 0;
        break;
      case 11: //kleenex 1
        tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/4, 0,1,0));
        tr_ball = tr_ball.times(Mat4.translation(0,-.4,0));
        tr_ball = tr_ball.times(Mat4.scale(2/3,2/3,2/3));
        this.ball_scale = 2/3;
        this.correct_bin = 1;
        break;
      case 12: //chocolate
        tr_ball = tr_ball.times(Mat4.translation(0,-1.55,0));
        tr_ball = tr_ball.times(Mat4.rotation(Math.PI/2, 1,0,0));
        tr_ball = tr_ball.times(Mat4.scale(1,1/10,1/2));
        this.correct_bin = 0;
        break;
      case 13: //starbucks cup
        this.correct_bin = 2;
        break;
      case 14: //apple
        this.correct_bin = 0;
        tr_ball = tr_ball.times(Mat4.translation(0,-1.25,0));
        tr_ball = tr_ball.times(Mat4.scale(1/2,1/2,1/2));
        this.ball_scale = 1/2;
        break;
      case 15: //calpico
        tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/4, 0,1,0));
        tr_ball = tr_ball.times(Mat4.translation(0,0.17,0));
        this.correct_bin = 0;
        break;
      case 16: //coconut water 
        tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/4, 0,1,0));
        tr_ball = tr_ball.times(Mat4.translation(0,-.45,0));
        this.correct_bin = 0;
        break;
      case 17: //baseball 
        tr_ball = tr_ball.times(Mat4.translation(0,-1.7,0));
        tr_ball = tr_ball.times(Mat4.scale(2/5,2/5,2/5)); 
        this.ball_scale = 2/5;
        this.correct_bin = 1;
        break;
      case 18: //nat geo mag 3
        tr_ball = tr_ball.times(Mat4.translation(0,-2,0));
        tr_ball = tr_ball.times(Mat4.scale(3/2,3/2,3/2));
        this.ball_scale = 3/2;
        this.correct_bin = 1;
        break;
      case 19: //arizona tea
        tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/4, 0,1,0));
        tr_ball = tr_ball.times(Mat4.translation(0,-.1,0));
        this.correct_bin = 0;
        break;
      case 20: //crayons
        tr_ball = tr_ball.times(Mat4.translation(0,-1.9,0));
        this.correct_bin = 1;
        break;
      case 21: //paper plane
        tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/4, 0,1,0));
        tr_ball = tr_ball.times(Mat4.translation(0,-1,0));
        this.correct_bin = 2;
        break;
      case 22: //nat geo mag 2
        tr_ball = tr_ball.times(Mat4.translation(0,-2,0));
        tr_ball = tr_ball.times(Mat4.scale(3/2,3/2,3/2));
        this.ball_scale = 3/2;
        this.correct_bin = 1;
        break;
      case 23: //crumpled paper 2
        tr_ball = tr_ball.times(Mat4.translation(0,-1.2,0));
        tr_ball = tr_ball.times(Mat4.scale(2/3,2/3,2/3));
        this.ball_scale = 2/3;
        this.correct_bin = 2;
        break;
      default: 
        break;
    }

    /* challenge mode */
    if (this.challenge) {
        this.song_t += 0.01;
        this.bass_drop = 0;

        if (this.song_t > this.bass_drop) {
            this.tempo = 10.8;
            /* bin1 groove */
            if (this.bin1_t >= 0 && this.bin1_t <= this.tempo) {
                this.tr_bin1 = this.tr_bin1.times(Mat4.translation(0,0,-4));
                this.bin1_z_max = this.bin1_z_max_og - 4;
                this.bin1_z_min = this.bin1_z_min_og - 4;
                this.bin1_t += 0.1;
                this.bin1_steps = -4;
            }
            else if (this.bin1_t > this.tempo && this.bin1_t <= this.tempo*2) {
                this.bin1_t += 0.1;
                this.bin1_z_max = this.bin1_z_max_og;
                this.bin1_z_min = this.bin1_z_min_og;
                this.bin1_steps = 0;
            }
            if (this.bin1_t >= this.tempo*2) {
                this.bin1_t = 0;
                this.bin1_z_max = this.bin1_z_max_og;
                this.bin1_z_min = this.bin1_z_min_og;
                this.bin1_steps = 0;
            }

            /* bin0 groove */
            if (this.bin0_t >= 0 && this.bin0_t <= this.tempo/2) {
                this.tr_bin0 = this.tr_bin0.times(Mat4.translation(0,0,-6));
                this.bin0_z_max = this.bin0_z_max_og - 6;
                this.bin0_z_min = this.bin0_z_min_og - 6;
                this.bin0_t += 0.1;
                this.bin0_stage = 1;
                this.bin0_steps = -6;

            }
            else if (this.bin0_t >= this.tempo/2 && this.bin0_t <= this.tempo) {
                this.tr_bin0 = this.tr_bin0.times(Mat4.translation(0,0,-8));
                this.bin0_z_max = this.bin0_z_max_og - 8;
                this.bin0_z_min = this.bin0_z_min_og - 8;
                this.bin0_t += 0.1;
                this.bin0_stage = 2;
                this.bin0_steps = -8;
            }
            else if (this.bin0_t > this.tempo && this.bin0_t <= this.tempo*3/2) {
                this.bin0_z_max = this.bin0_z_max_og;
                this.bin0_z_min = this.bin0_z_min_og;
                this.bin0_t += 0.1;
                this.bin0_stage = 3;
                this.bin0_steps = 0;
            }
            else if (this.bin0_t > this.tempo*3/2 && this.bin0_t <= this.tempo*2) {
                this.tr_bin0 = this.tr_bin0.times(Mat4.translation(0,0,-8));
                this.bin0_z_max = this.bin0_z_max_og - 8;
                this.bin0_z_min = this.bin0_z_min_og - 8;
                this.bin0_t += 0.1;
                this.bin0_stage = 4;
                this.bin0_steps = -8;
            }
            if (this.bin0_t >= this.tempo*2) {
                this.bin0_z_max = this.bin0_z_max_og;
                this.bin0_z_min = this.bin0_z_min_og;
                this.bin0_t = 0;
                this.bin0_stage = 1;
            }

            /* bin2 groove */
            if (this.bin2_t >= 0 && this.bin2_t <= this.tempo/2) {
                this.tr_bin2 = this.tr_bin2.times(Mat4.translation(0,0,-8));
                this.bin2_z_max = this.bin2_z_max_og - 8;
                this.bin2_z_min = this.bin2_z_min_og - 8;
                this.bin2_t += 0.1;
                this.bin2_steps = -8;
            }
            else if (this.bin2_t >= this.tempo/2 && this.bin2_t <= this.tempo) {
                this.tr_bin2 = this.tr_bin2.times(Mat4.translation(0,0,-6));
                this.bin2_z_max = this.bin2_z_max_og - 6;
                this.bin2_z_min = this.bin2_z_min_og - 6;
                this.bin2_t += 0.1;
                this.bin2_steps = -6;
            }
            else if (this.bin2_t > this.tempo && this.bin2_t <= this.tempo*3/2) {
                this.tr_bin2 = this.tr_bin2.times(Mat4.translation(0,0,-8));
                this.bin2_z_max = this.bin2_z_max_og - 8;
                this.bin2_z_min = this.bin2_z_min_og - 8;
                this.bin2_t += 0.1;
                this.bin2_steps = -8;
            }
            else if (this.bin2_t > this.tempo*3/2 && this.bin2_t <= this.tempo*2) {
                this.bin2_z_max = this.bin2_z_max_og;
                this.bin2_z_min = this.bin2_z_min_og;
                this.bin2_t += 0.1;
                this.bin2_steps = 0;

            }
            if (this.bin2_t >= this.tempo*2) {
                 this.bin2_z_max = this.bin2_z_max_og;
                this.bin2_z_min = this.bin2_z_min_og;
                this.bin2_t = 0;
                this.bin2_steps = 0;
            }
        }      
    }

    /* begin projectile's trajectory */
    if (this.throw) {

      let ball_z_temp;
      let ball_y_temp;
      
      /* increase timer, calculate ball position in y-axis and z-axis */
      this.ball_t += 0.05;
      ball_z_temp = -20 * 0.5 * this.ball_t;
      ball_y_temp = 23 * 0.866 * (this.ball_t) - 1 / 2 * 9.8 * (this.ball_t ** 2);

      (ball_y_temp > 0)? this.ball_y = ball_y_temp : this.ball_y = 0;
      
      /* standardize z value so ball doesn't pass through bin's back side */
      if (this.ball_angle_init < 0.11 && this.ball_angle_init > -0.11 &&
          ball_z_temp <= this.bin1_z_max) {
              ball_z_temp = Math.max(ball_z_temp, this.bin1_z_min);
       }
      else if (this.ball_angle_init < 0.61 && this.ball_angle_init > 0.34 &&
          ball_z_temp <= this.bin0_z_max) {
              ball_z_temp = Math.max(ball_z_temp, -33);
       }
      else if (this.ball_angle_init >= -0.61 && this.ball_angle_init <= -0.39 &&
          ball_z_temp <= this.bin2_z_max) {
              ball_z_temp = Math.max(ball_z_temp, -33);
       }

      /* if ball lands in correct bin, increment score */
      let goal = this.in_bin(this.correct_bin, this.ball_y, ball_z_temp);
      
      /* left rim of bin1 */
      if (Math.abs(this.ball_angle_init - 0.1) < 0.01 && 
          ball_z_temp <= this.bin1_z_max && ball_z_temp >= this.bin1_z_min &&
          this.ball_y - this.bin_y_max < .5 && this.first_bounce) {
            this.first_bounce = false;
            this.bounce_left = true;
            this.bounce_time = this.ball_t;
            this.bounce_height = Math.random()*10+20;
      }

      /* right rim of bin1 */
      else if (Math.abs(this.ball_angle_init + 0.1) < 0.01 && 
          ball_z_temp <= this.bin1_z_max && ball_z_temp >= this.bin1_z_min &&
          this.ball_y - this.bin_y_max < .5 && this.first_bounce) {
            this.first_bounce = false;
            this.bounce_right = true;
            this.bounce_time = this.ball_t;
            this.bounce_height = Math.random()*10+20;
      }
            
      /* left rim of bin0 ==> bounces out */
      else if (this.ball_angle_init <= 0.601 && this.ball_angle_init >= 0.599 &&
          ball_z_temp <= this.bin0_z_max && ball_z_temp >= this.bin0_z_min &&
          this.ball_y - this.bin_y_max < 1 && this.first_bounce) {
            this.first_bounce = false;
            this.bounce_left = true;
            this.bounce_time = this.ball_t;
            this.bounce_height = Math.random()*10+20;
      }

      /* left rim of bin0 ==> bounces in */
      else if (this.ball_angle_init <= 0.551 && this.ball_angle_init >= 0.548 &&
          ball_z_temp <= this.bin0_z_max && ball_z_temp >= this.bin0_z_min &&
          this.ball_y - this.bin_y_max < 1 && this.first_bounce) {
            this.first_bounce = false;
            this.bounce_up_right = true;
            this.bounce_time = this.ball_t;
      }


      /* right rim of bin0 ==> bounces out */
      else if (this.ball_angle_init <= 0.351 && this.ball_angle_init >= 0.349 &&
          ball_z_temp <= this.bin0_z_max && ball_z_temp >= this.bin0_z_min &&
          this.ball_y - this.bin_y_max <= 1 && this.first_bounce) {
            this.first_bounce = false;
            this.bounce_right = true;
            this.bounce_time = this.ball_t;
            this.bounce_height = Math.random()*10+20;
      }

      /* right rim of bin0 ==> bounces in */
      else if (this.ball_angle_init <= 0.401 && this.ball_angle_init >= 0.399 &&
          ball_z_temp <= this.bin0_z_max && ball_z_temp >= this.bin0_z_min &&
          this.ball_y - this.bin_y_max < 1 && this.first_bounce) {
            this.first_bounce = false;
            this.bounce_up_left = true;
            this.bounce_time = this.ball_t;
      }
         
      /* left rim of bin2 ==> bounces in */
      else if (this.ball_angle_init <= -0.399 && this.ball_angle_init >= -0.401 &&
          ball_z_temp <= this.bin2_z_max && ball_z_temp >= this.bin2_z_min &&
          this.ball_y - this.bin_y_max < 1 && this.first_bounce) {
            this.first_bounce = false;
            this.bounce_up_right = true;
            this.bounce_time = this.ball_t;
      }
               
      /* left rim of bin2 ==> bounces out */
      else if (this.ball_angle_init <= -0.349 && this.ball_angle_init >= -0.351 &&
          ball_z_temp <= this.bin2_z_max && ball_z_temp >= this.bin2_z_min &&
            this.ball_y - this.bin_y_max < 1 && this.first_bounce) {
            this.first_bounce = false;
            this.bounce_left = true;
            this.bounce_time = this.ball_t;
            this.bounce_height = Math.random()*10+20;
      }


      /* right rim of bin2 ==> bounces in */
      else if (this.ball_angle_init <= -0.549 && this.ball_angle_init >= -0.551 &&
          ball_z_temp <= this.bin2_z_max && ball_z_temp >= this.bin2_z_min &&
          this.ball_y - this.bin_y_max < 1 && this.first_bounce) {
            this.first_bounce = false;
            this.bounce_up_left = true;
            this.bounce_time = this.ball_t;
      }

      /* right rim of bin2 ==> bounces out */
      else if (Math.abs(this.ball_angle_init + 0.6) < 0.01 && 
          ball_z_temp <= this.bin2_z_max && ball_z_temp >= this.bin2_z_min &&
          this.ball_y - this.bin_y_max < 1 && this.first_bounce) {
            this.first_bounce = false;
            this.bounce_right = true;
            this.bounce_time = this.ball_t;
            this.bounce_height = Math.random()*10+20;
      }
      
      if (this.bounce_left) {
        this.ball_x -= 0.1;
        this.ball_y = Math.max(0, 0.9*ball_y_temp + this.bounce_height * 0.866 * (this.ball_t - this.bounce_time) - 1 / 2 * 9.8 * ((this.ball_t - this.bounce_time) ** 2));    
      }
      else if (this.bounce_right) {
        this.ball_x += 0.1;
        this.ball_y = Math.max(0, 0.9*ball_y_temp + this.bounce_height * 0.866 * (this.ball_t - this.bounce_time) - 1 / 2 * 9.8 * ((this.ball_t - this.bounce_time) ** 2));    
      }
      else if (this.bounce_up_right) {
        this.ball_y = Math.max(0, 0.9*ball_y_temp + 20*0.866 * (this.ball_t - this.bounce_time) - 1 / 2 * 9.8 * ((this.ball_t - this.bounce_time) ** 2));
        this.ball_x += 0.1;  
      }
      else if (this.bounce_up_left ) {
        this.ball_x -= 0.1;
        this.ball_y = Math.max(0,0.9*ball_y_temp + 30*0.866 * (this.ball_t - this.bounce_time) - 1 / 2 * 9.8 * ((this.ball_t - this.bounce_time) ** 2)); 
      }
      else if (this.bounce_front && this.ball_y < 0.1) {
        if (this.first_bounce) {
            this.bounce_time = this.ball_t;
            this.first_bounce = false;
        }
            this.ball_y = Math.max(0, 15*0.866*(this.ball_t - this.bounce_time) - 1 / 2 * 9.8 * ((this.ball_t - this.bounce_time) ** 2));
      }
      else if (!this.bounce_front) {
          this.ball_z = ball_z_temp;
      }

      /* slowly fade out ball by decrementing opacity */
      if (this.ball_y <= 0) {
        this.ball_op -= 0.2;
      }

      /* ball stops trajectory if it completely disappeared */
      if (this.ball_op <= 0) {
        this.throw = false;
        this.type = (this.type + 1)%24;

      }

      switch(this.type) {
        case 0: //kleenex 2 
          tr_ball = tr_ball.times(Mat4.rotation(Math.PI/2, 0,1,0));
          tr_ball = tr_ball.times(Mat4.scale(3/2,3/2,3/2));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.8*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-.3*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/2, 0,1,0));
          tr_ball = tr_ball.times(Mat4.scale(2/3,2/3,2/3));
          break;
        case 1: //pocky
          tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/4, 0,1,0));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.9*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(0.5*Math.PI*this.ball_t, 1, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.rotation(Math.PI/4, 0,1,0));
          break;
        case 2: //orange
          tr_ball = tr_ball.times(Mat4.scale(2,2,2));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.9*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.scale(.5,.5,.5));
          break;
        case 3: //nat geo mag 1
          tr_ball = tr_ball.times(Mat4.scale(2/3,2/3,2/3));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.95*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.scale(3/2,3/2,3/2));
          break;
        case 4: //magic 8 ball 
          tr_ball = tr_ball.times(Mat4.rotation(Math.PI/2, 0,1,0));
          tr_ball = tr_ball.times(Mat4.scale(5/2,5/2,5/2)); 
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.9*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-Math.PI*this.ball_t, 1,0,0));
          tr_ball = tr_ball.times(Mat4.scale(2/5,2/5,2/5)); 
          tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/2, 0,1,0));
          break;
        case 5: //pineapple
          tr_ball = tr_ball.times(Mat4.scale(3/2,4/3,3/2)); 
          tr_ball = tr_ball.times(Mat4.translation(0.7*this.ball_x, 0.75*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-0.1*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.scale(2/3,3/4,2/3)); 
          break;
        case 6: //crumpled paper 1
          tr_ball = tr_ball.times(Mat4.scale(3/2,3/2,3/2));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.95*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.scale(2/3,2/3,2/3));
          break;
        case 7: //newspaper
          tr_ball = tr_ball.times(Mat4.rotation(Math.PI/2, 0,1,0));
          tr_ball = tr_ball.times(Mat4.scale(3/4,3/4,3/4));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/2, 0,1,0));
          tr_ball = tr_ball.times(Mat4.scale(4/3,4/3,4/3));
          break;
        case 8: //coca cola 
          tr_ball = tr_ball.times(Mat4.scale(4/3,4/3,4/3));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.8*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(0.1*Math.PI*this.ball_t, 1, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.scale(3/4,3/4,3/4));
          break;
        case 9: //eaten apple
          tr_ball = tr_ball.times(Mat4.scale(2,2,2));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.9*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.scale(.5,.5,.5));
          break;
        case 10: //bananas 
          tr_ball = tr_ball.times(Mat4.scale(4/3,4/3,4/3));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.9*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.scale(3/4,3/4,3/4));
          break;
        case 11: //kleenex 1 
          tr_ball = tr_ball.times(Mat4.rotation(Math.PI/4, 0,1,0));
          tr_ball = tr_ball.times(Mat4.scale(3/2,3/2,3/2));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.8*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-.3*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/4, 0,1,0));
          tr_ball = tr_ball.times(Mat4.scale(2/3,2/3,2/3));
          break;
        case 12: //chocolate
          tr_ball = tr_ball.times(Mat4.scale(1,10,2));
          tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/2, 1,0,0));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.75*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-.3*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.rotation(Math.PI/2, 1,0,0));
          tr_ball = tr_ball.times(Mat4.scale(1,1/10,1/2));
          break;
        case 13: //starbucks 
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.85*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          break;
        case 14: //apple
          tr_ball = tr_ball.times(Mat4.scale(2,2,2)); 
          tr_ball = tr_ball.times(Mat4.translation(0.7*this.ball_x, 0.9*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-0.1*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.scale(1/2,1/2,1/2)); 
          break;
        case 15: //calpico
          tr_ball = tr_ball.times(Mat4.rotation(Math.PI/4, 0,1,0));
          tr_ball = tr_ball.times(Mat4.translation(0.8*this.ball_x, 0.8*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(0.1*Math.PI*this.ball_t, 1, 0, this.spin_z));

          break;
        case 16: //coconut water
          tr_ball = tr_ball.times(Mat4.rotation(Math.PI/4, 0,1,0));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.8*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/4, 0,1,0));
          tr_ball = tr_ball.times(Mat4.rotation(0.4*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          break;
        case 17: //baseball 
          tr_ball = tr_ball.times(Mat4.scale(5/2,5/2,5/2));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.9*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(0.1*Math.PI*this.ball_t, 1, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.scale(2/5,2/5,2/5));
          break;
        case 18: //nat geo mag 3
          tr_ball = tr_ball.times(Mat4.scale(2/3,2/3,2/3));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.95*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.scale(3/2,3/2,3/2));
          break;
        case 19: //arizona 
          tr_ball = tr_ball.times(Mat4.rotation(Math.PI/4, 0,1,0));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.85*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/4, 0,1,0));
          tr_ball = tr_ball.times(Mat4.rotation(0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          break;
        case 20: //crayons
          tr_ball = tr_ball.times(Mat4.translation(0.9*this.ball_x, 0.95*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 1, this.spin_z));
          break;
        case 21: //paper plane
          tr_ball = tr_ball.times(Mat4.rotation(Math.PI/4, 0,1,0));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.85*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(Math.PI*this.ball_t, this.spin_x, 1, this.spin_z));
          tr_ball = tr_ball.times(Mat4.rotation(-Math.PI/4, 0,1,0));
          break;
        case 22: //nat geo mag 2
          tr_ball = tr_ball.times(Mat4.scale(2/3,2/3,2/3));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.95*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.scale(3/2,3/2,3/2));
          break;
        case 23: //crumpled paper 2
          tr_ball = tr_ball.times(Mat4.scale(3/2,3/2,3/2));
          tr_ball = tr_ball.times(Mat4.translation(this.ball_x, 0.95*this.ball_y, this.ball_z));
          tr_ball = tr_ball.times(Mat4.rotation(-Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
          tr_ball = tr_ball.times(Mat4.scale(2/3,2/3,2/3));
          break;
        default:
          break;
      }
    }

    
    /* draw projectil shadow */
    let size = this.ball_scale/(Math.max(1,(Math.min(0.08*this.ball_y,5))));
    let tr_ball_shadow = Mat4.identity();
    tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(this.ball_angle_init, 0,1,0));
    tr_ball_shadow = tr_ball_shadow.times(Mat4.translation(this.ball_x, 0.001, this.ball_z));
    tr_ball_shadow = tr_ball_shadow.times(Mat4.scale(size,0,size));
   
    /* reset ball after a throw is done */
    if (!this.throw && this.ball_op < 1) {
        this.ball_x = 0;
        this.ball_y = 0.1;
        this.first_bounce = true;
        this.bounce_front = false;
        this.bounce_left = false;
        this.bounce_right = false;
        this.bounce_up_right = false;
        this.bounce_up_left = false;
        this.scored = false;
        this.penalized = false;
        this.ball_t = 0;
        this.ball_op += .1;
        this.spin_x = Math.floor(Math.random()*4)-2;
        this.spin_y = Math.floor(Math.random()*4)-2;
        this.spin_z = Math.floor(Math.random()*4)-2;
        this.failed = false;
    }



    /* draw floor, lights, walls, doors, and backdrop */
    this.shapes.plane.draw(context, program_state, tr_floor, this.materials.floor_tile_bump_map); 
 
    let tr_window = Mat4.identity();
    tr_window = tr_window.times(Mat4.translation(40,20.5,-26));
    tr_window = tr_window.times(Mat4.rotation(-Math.PI/2, 0,1,0));
    tr_window = tr_window.times(Mat4.scale(50,56,50));

    let tr_shelf1 = Mat4.identity();
    tr_shelf1 = tr_shelf1.times(Mat4.translation(-30,8,0));
    tr_shelf1 = tr_shelf1.times(Mat4.rotation(-Math.PI/2, 0,1,0));

    tr_shelf1 = tr_shelf1.times(Mat4.scale(40,46,40));
    
    let tr_vending_machine = Mat4.identity(); 
    tr_vending_machine = tr_vending_machine.times(Mat4.translation(32, 7.61, -63));
    tr_vending_machine = tr_vending_machine.times(Mat4.scale(7, 7, 7));
    tr_vending_machine = tr_vending_machine.times(Mat4.rotation( -Math.PI/2, 0, 1, 0));

    let tr_vending_sh = Mat4.identity(); 
    tr_vending_sh = tr_vending_sh.times(Mat4.translation(40, 0.01, -73.2));
    tr_vending_sh = tr_vending_sh.times(Mat4.scale(7, 0, 7));
    tr_vending_sh = tr_vending_sh.times(Mat4.rotation( Math.PI/4, 0, 1, 0));
    tr_vending_sh = tr_vending_sh.times(Mat4.scale(2, 0, 1));

    let tr_vending_sh2 = Mat4.identity(); 
    tr_vending_sh2 = tr_vending_sh2.times(Mat4.translation(39, 7, -76));
    tr_vending_sh2 = tr_vending_sh2.times(Mat4.rotation( Math.PI, 0, 1, 0));

    tr_vending_sh2 = tr_vending_sh2.times(Mat4.rotation( Math.PI/2, 1, 0, 0));

    tr_vending_sh2 = tr_vending_sh2.times(Mat4.scale(7, 0.1, 12));
    tr_vending_sh2 = tr_vending_sh2.times(Mat4.scale(2, 0.1, 1));

//     let tr_cat = Mat4.translation(32, 17, -63).times(Mat4.rotation(Math.PI/-2, 0, 1, 0));
//     let tr_cat_arm = Mat4.translation(1, 0, 0).times(tr_cat); 

    let tr_cat = Mat4.translation( 29, 18.1, -63).times(Mat4.rotation(Math.PI/-2, 0, 1, 0)); 
    let tr_cat_arm = Mat4.translation(1.2, 0.1, 0);
    tr_cat_arm = tr_cat_arm.times(tr_cat);
    tr_cat_arm = tr_cat_arm.times(Mat4.translation(0, -1/4, 0));
    tr_cat_arm = tr_cat_arm.times(Mat4.rotation(Math.PI/4*Math.sin(this.t/400) - Math.PI/6, 0, 0, 1));
    tr_cat_arm = tr_cat_arm.times(Mat4.translation(0, 1/4, 0));
    tr_cat_arm = tr_cat_arm.times(Mat4.scale(1/2, 1/2, 1/2));

    this.shapes.plane.draw(context, program_state, tr_back_wall, this.materials.white_wall); 
    this.shapes.plane.draw(context, program_state, tr_left_wall, this.materials.tan_wall); 
    this.shapes.plane.draw(context, program_state, tr_left_door, this.materials.tan_wall);
    this.shapes.window.draw(context, program_state, tr_window, this.materials.window); 
    this.shapes.shelves.draw(context, program_state, tr_shelf1, this.materials.shelves); 
    this.shapes.vending_machine.draw(context, program_state, tr_vending_machine, this.materials.vending_machine);
    this.shapes.cat.draw(context, program_state, tr_cat, this.materials.cat);
    this.shapes.cat_arm.draw(context, program_state, tr_cat_arm, this.materials.cat_arm);

    this.shapes.vending_machine.draw(context, program_state, tr_vending_sh, this.materials.shadow);
    this.shapes.vending_machine.draw(context, program_state, tr_vending_sh2, this.materials.shadow);




    this.shapes.plane.draw(context, program_state, tr_backdrop, this.materials.landscape); 


    /* draw trajectory arc */
    if (!this.throw) { this.shapes.arc.draw(context, program_state, tr_arc, this.materials.arc); }

    /* draw projectile */    
    switch(this.type) {
        case 0: //kleenex 2
            this.shapes.kleenex_2.draw(context, program_state, tr_ball, this.materials.kleenex_2.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(-.3*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
            this.shapes.kleenex_2.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 1: //pocky
            this.shapes.pocky.draw(context, program_state, tr_ball, this.materials.pocky.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(Math.PI/4, 0,1,0));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(0.5*Math.PI*this.ball_t, 1, 0, this.spin_z));
            this.shapes.pocky.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 2: //orange
            this.shapes.orange.draw(context, program_state, tr_ball, this.materials.orange.override(color(0,0,0,this.ball_op)));
            this.shapes.orange.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 3: //nat geo mag 1
            this.shapes.nat_geo_mag_1.draw(context, program_state, tr_ball, this.materials.nat_geo_mag_1.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
            this.shapes.nat_geo_mag_1.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 4: //magic 8 ball
            this.shapes.ball.draw(context, program_state, tr_ball, this.materials.magic8ball.override(color(0,0,0,this.ball_op)));
            this.shapes.ball.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 5: //pineapple
            this.shapes.pineapple.draw(context, program_state, tr_ball, this.materials.pineapple.override(color(0,0,0,this.ball_op)));
             tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(-0.1*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
            this.shapes.pineapple.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 6: //crunmpled paper 1
            this.shapes.crumpled_paper_1.draw(context, program_state, tr_ball, this.materials.crumpled_paper_1.override(color(0,0,0,this.ball_op)));
            this.shapes.crumpled_paper_1.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 7: //newspaper
            this.shapes.newspaper.draw(context, program_state, tr_ball, this.materials.newspaper.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
            this.shapes.newspaper.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 8: //coca cola 
            this.shapes.coke.draw(context, program_state, tr_ball, this.materials.coke.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(0.1*Math.PI*this.ball_t, 1, 0, this.spin_z));
            this.shapes.coke.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 9: //eaten apple
            this.shapes.eaten_apple.draw(context, program_state, tr_ball, this.materials.eaten_apple.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
            this.shapes.eaten_apple.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 10: //bananas
            this.shapes.bananas.draw(context, program_state, tr_ball, this.materials.bananas.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
            this.shapes.bananas.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 11: //kleenex 1 
            this.shapes.kleenex_1.draw(context, program_state, tr_ball, this.materials.kleenex_1.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(Math.PI/4, 0,1,0));
            this.shapes.kleenex_1.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 12: //chocolate
            this.shapes.cube.draw(context, program_state, tr_ball, this.materials.chocolate.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(-.3*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));

            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(Math.PI/2, 1,0,0));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.scale(1,1/10,1/2));

            this.shapes.cube.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 13: //starbucks 
            this.shapes.starbucks.draw(context, program_state, tr_ball, this.materials.starbucks.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
            this.shapes.starbucks.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 14: //apple
            this.shapes.apple.draw(context, program_state, tr_ball, this.materials.apple.override(color(0,0,0,this.ball_op)));
            this.shapes.apple.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 15: //calpico
            this.shapes.calpico.draw(context, program_state, tr_ball, this.materials.calpico.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(-Math.PI/4, 0,1,0));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(0.1*Math.PI*this.ball_t, 1, 0, this.spin_z));
            this.shapes.calpico.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 16: //coconut water 
            this.shapes.coconut_water.draw(context, program_state, tr_ball, this.materials.coconut_water.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(0.4*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
            this.shapes.coconut_water.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 17: //baseball 
            this.shapes.ball.draw(context, program_state, tr_ball, this.materials.baseball.override(color(0,0,0,this.ball_op)));
            this.shapes.ball.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 18: //nat geo mag 3
            this.shapes.nat_geo_mag_3.draw(context, program_state, tr_ball, this.materials.nat_geo_mag_3.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
            this.shapes.nat_geo_mag_3.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 19: //arizona
            this.shapes.arizona.draw(context, program_state, tr_ball, this.materials.arizona.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
            this.shapes.arizona.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 20: //crayons 
            this.shapes.crayons.draw(context, program_state, tr_ball, this.materials.crayons.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 1, this.spin_z));
            this.shapes.crayons.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 21: //paper plane
            this.shapes.paper_plane.draw(context, program_state, tr_ball, this.materials.paper_plane.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(-Math.PI/4, 0,1,0)).times(Mat4.rotation(Math.PI*this.ball_t, this.spin_x, 1, this.spin_z));
            this.shapes.paper_plane.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
        case 22: //nat geo mag 2
            this.shapes.nat_geo_mag_2.draw(context, program_state, tr_ball, this.materials.nat_geo_mag_2.override(color(0,0,0,this.ball_op)));
            tr_ball_shadow = tr_ball_shadow.times(Mat4.rotation(-0.5*Math.PI*this.ball_t, this.spin_x, 0, this.spin_z));
            this.shapes.nat_geo_mag_2.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
            break;
        case 23: //crunmpled paper 2
            this.shapes.crumpled_paper_2.draw(context, program_state, tr_ball, this.materials.crumpled_paper_2.override(color(0,0,0,this.ball_op)));
            this.shapes.crumpled_paper_2.draw(context, program_state, tr_ball_shadow, this.materials.shadow);
            break;
    }


    /* draw bins and shadows */
    //actual bins
    let placeCrate = Mat4.translation(0, -0.07, 0).times(Mat4.scale(1.5, 1.215, 2)).times(Mat4.rotation(3 * Math.PI/2, 0, 1, 0)); 

//     this.shapes.bin.draw(context, program_state, this.tr_bin0, this.materials.bin0);
//     this.shapes.bin.draw(context, program_state, this.tr_bin1, this.materials.bin1);
//     this.shapes.bin.draw(context, program_state, this.tr_bin2, this.materials.bin2);

    //draw crates
    this.shapes.trash_crate.draw(context, program_state, this.tr_bin2.times(placeCrate), this.materials.trash_crate);
    this.shapes.home_office_crate.draw(context, program_state, this.tr_bin1.times(placeCrate), this.materials.home_office_crate);
    this.shapes.food_crate.draw(context, program_state, this.tr_bin0.times(placeCrate), this.materials.food_crate);
    //shadows
    this.shapes.food_crate.draw(context, program_state, tr_bin0_shadow, this.materials.shadow);
    this.shapes.home_office_crate.draw(context, program_state, tr_bin1_shadow, this.materials.shadow);
    this.shapes.trash_crate.draw(context, program_state, tr_bin2_shadow, this.materials.shadow);

    this.shapes.cashier.draw(context, program_state, tr_cashier, this.materials.cashier);

    let tr_cashier_sh = Mat4.identity();
    tr_cashier_sh = tr_cashier_sh.times(Mat4.translation(19.5,0.01,-70.3));
    tr_cashier_sh = tr_cashier_sh.times(Mat4.rotation(Math.PI/3, 0,1,0));
    tr_cashier_sh = tr_cashier_sh.times(Mat4.scale(4,0,4));

    this.shapes.cashier.draw(context, program_state, tr_cashier_sh, this.materials.shadow);

    if (this.t/1000 - this.monitor_t < 24) {
        if (this.t/1000 - this.monitor_t < 1) { this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_1); }
        else if (this.t/1000 - this.monitor_t < 2) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_2); }
        else if (this.t/1000 - this.monitor_t < 3) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_3); }
        else if (this.t/1000 - this.monitor_t < 4) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_4); }
        else if (this.t/1000 - this.monitor_t < 5) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_5); }
        else if (this.t/1000 - this.monitor_t < 6) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_6); }
        else if (this.t/1000 - this.monitor_t < 7) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_7); }
        else if (this.t/1000 - this.monitor_t < 8) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_8); }
        else if (this.t/1000 - this.monitor_t < 9) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_9); }
        else if (this.t/1000 - this.monitor_t < 10) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_10); }
        else if (this.t/1000 - this.monitor_t < 11) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_11); }
        else if (this.t/1000 - this.monitor_t < 12) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_12); }
        else if (this.t/1000 - this.monitor_t < 13) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_13); }
        else if (this.t/1000 - this.monitor_t < 14) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_14); }
        else if (this.t/1000 - this.monitor_t < 15) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_15); }
        else if (this.t/1000 - this.monitor_t < 16) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_16); }
        else if (this.t/1000 - this.monitor_t < 17) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_17); }
        else if (this.t/1000 - this.monitor_t < 18) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_18); }
        else if (this.t/1000 - this.monitor_t < 19) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_19); }
        else if (this.t/1000 - this.monitor_t < 20) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_20); }
        else if (this.t/1000 - this.monitor_t < 21) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_21); }
        else if (this.t/1000 - this.monitor_t < 22) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_22); }
        else if (this.t/1000 - this.monitor_t < 23) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_23); }
        else if (this.t/1000 - this.monitor_t < 24) {this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_24); }
    }
    else {
        this.shapes.monitor.draw(context, program_state, tr_monitor, this.materials.monitor_1);
        this.monitor_t = this.t/1000;
    }




    this.initial_camera_location = Mat4.inverse((Mat4.translation(-1,-8,-20)));
    let messageModelTransform = this.initial_camera_location.times(Mat4.translation(-14,7.5,-15.5)) // [-11,5.5,-15] for scoreboard
                               .times(Mat4.scale(0.35,0.35,0.35));

     // Score Board

      var once = 0;
      
      if (window.ready) {
          this.time = (this.t - this.end_seq_t)/1000;
      }

      if(this.challenge == true)
      {
        if (this.time >= 0) 
        {
            let line = "SCORE:" + this.score + " TIME:" + Math.round(this.time);
            this.shapes.text.set_string(line, context.context);
            this.shapes.text.draw(context, program_state, messageModelTransform, this.materials.text_image);
        }
      }
      else if (this.time >= 0)
      {
            let line = "SCORE:" + this.score + "  LIFE:" + this.life + "  TIME:" + Math.round(this.time);
            this.shapes.text.set_string(line, context.context);
            this.shapes.text.draw(context, program_state, messageModelTransform, this.materials.text_image);
      }

      this.timeover = false;

      if(this.time >= 60 && once == 0)
      {
        this.timeover = true;
        once = once + 1;
      }

      if(this.timeover)
      {
        this.life = 0;
        this.curr_bg.pause();
        var game_overmusic  = this.sounds.gameover_music;
        game_overmusic.play();
        game_overmusic = null;
        this.game_over = true;


      //  this.reset_se()
      /*;
        this.curr_bg = this.sounds.gameover_music;
        this.curr_bg.load();
        this.curr_bg.play();
        this.game_over = true;
      */
      }


      //display Game Over Screen
      if(this.game_over || (this.time >= 60 && this.score < 30 && !this.game_end && this.lives < 5))
      {
          this.shapes.plane.draw(context, program_state, tr_intro_pink, this.materials.pink_wall); 
          this.shapes.plane.draw(context, program_state, tr_intro_white, this.materials.white_wall);  
          this.shapes.plane.draw(context, program_state, tr_end_girl, this.materials.girl_sad); 
          this.shapes.plane.draw(context, program_state, tr_end_text, this.materials.end_lose);
          this.shapes.plane.draw(context, program_state, tr_intro_start, this.materials.end_restart);
          program_state.set_camera( Mat4.translation(0, 0, 50).times(Mat4.rotation(Math.PI, 0, 1, 0)) );
      }       

      //display Game Ending
      else if(!this.game_over && this.time < 60 && this.life > 0 && this.score >= 30) //this.score should be over 30, I set this.score >= 1 for testing
      {
          this.shapes.plane.draw(context, program_state, tr_intro_pink, this.materials.pink_wall); 
          this.shapes.plane.draw(context, program_state, tr_intro_white, this.materials.white_wall);  
//           this.shapes.plane.draw(context, program_state, tr_end_girl, this.materials.girl_happy); 
          this.shapes.cat.draw(context, program_state, tr_end_cat, this.materials.cat);
          this.shapes.cat_arm.draw(context, program_state, tr_end_cat_arm, this.materials.cat_arm);
          this.shapes.plane.draw(context, program_state, tr_end_text, this.materials.end_win);
          this.shapes.plane.draw(context, program_state, tr_intro_start, this.materials.end_restart);  
          program_state.set_camera( Mat4.translation(0, 0, 50).times(Mat4.rotation(Math.PI, 0, 1, 0)) );
          this.game_end = true;
      }

      else {
            /* draw components of start screen */
            this.shapes.plane.draw(context, program_state, tr_intro_pink, this.materials.pink_wall); 
            this.shapes.plane.draw(context, program_state, tr_intro_white, this.materials.white_wall);
            this.shapes.plane.draw(context, program_state, tr_intro_logo, this.materials.trader_throws_logo);  
            this.shapes.plane.draw(context, program_state, tr_intro_girl, this.materials.girl_throws); 
            this.shapes.plane.draw(context, program_state, tr_intro_text, this.materials.intro_text);
            this.shapes.plane.draw(context, program_state, tr_intro_start, this.materials.intro_start); 
            this.shapes.pocky.draw(context, program_state, tr_intro_pocky, this.materials.pocky); 
            this.shapes.coconut_water.draw(context, program_state, tr_intro_coconut_water, this.materials.coconut_water); 
            this.shapes.nat_geo_mag_1.draw(context, program_state, tr_intro_natgeo, this.materials.nat_geo_mag_1); 
    
      }
      //draw placeholder boxes: 
      let vegBoxL = Mat4.translation(-40, 4, -30).times(Mat4.rotation(Math.PI/2, 0, 1, 0)).times(Mat4.scale(10,4,6)).times(Mat4.rotation(Math.PI/2, 0, 1, 0));
      let vegBoxR = Mat4.translation(35, 4, -20).times(Mat4.rotation(Math.PI/2, 0, 1, 0)).times(Mat4.scale(12,4,6)).times(Mat4.rotation(Math.PI/-2, 0, 1, 0));
//       let cashReg = Mat4.translation(15, 3, -65).times(Mat4.scale(15,4,5));

//       this.shapes.food_crate.draw(context, program_state, vegBoxL, this.materials.food_crate);
      this.shapes.food_crate.draw(context, program_state, vegBoxR, this.materials.food_crate);
//       this.shapes.cube.draw(context, program_state, cashReg, this.materials.white_wall);


      this.set_boxes();

      let k = 0; 
      for (k; k < this.boxes.length; k++) 
            this.shapes.crate.draw(context, program_state, this.boxes[k], this.materials.crate);

      for (k = 0; k < this.boxes_shadows.length; k++) {
        this.shapes.crate.draw(context, program_state, this.boxes_shadows[k], this.materials.shadow);

      }




//       this.shapes.arizona.draw(context, program_state, Mat4.translation(-25, 2, -40), this.materials.arizona);
//       this.shapes.arizona.draw(context, program_state, Mat4.translation(-3, 2, -60), this.materials.arizona);
        
      this.draw_scattered(context,program_state);

    }
     set_boxes() { //version of the function with pre-set boxes, but randomized colors  
//         let pickMe = Math.floor(Math.random() * 3); //0, 1, 2
//         let yStretch = Math.floor(Math.random() * 5); 
//         let pickMe = 2; 
        let box1, box2, box3, box4, box5;
//            if (pickMe == 2) {
               box1 = Mat4.translation(-25, 4.5, -70);
               box1 = box1.times(Mat4.rotation(Math.PI/6, 0, 1, 0));
               box1 = box1.times(Mat4.rotation(Math.PI/2, 0, 0, 1));
               box1 = box1.times(Mat4.scale(6,8,6)); //(2, 2, 2) for big box
             
               box2 = box1;
               box2 = box2.times(Mat4.scale(0.5, 0.5, 0.5));
               box2 = box2.times(Mat4.translation(2.2, 0, 0));
               box2 = box2.times(Mat4.rotation(Math.PI/6, 1, 0, 0 ));

               box3 = Mat4.translation(-15, 3.2, -60);
               box3 = box3.times(Mat4.scale(3,4,3));

               box4 = Mat4.translation(-10, 2.25, -60);
               box4 = box4.times(Mat4.rotation(Math.PI/6, 0, 1, 0));
               box4 = box4.times(Mat4.scale(2, 3, 2));

           this.boxes = [box1, box2, box3, box4]; 
           let sh1 = Mat4.translation(-32,0.01, -75);
           sh1 = sh1.times(Mat4.rotation(Math.PI/4, 0,1,0));
           sh1 = sh1.times(Mat4.scale(6,0.1,8));
           sh1 = sh1.times(Mat4.shear(0));

           let sh2 = Mat4.translation(-32,0.01, -76);
           sh2 = sh2.times(Mat4.rotation(Math.PI/2, 1,0,0));
           sh2 = sh2.times(Mat4.scale(10,0.1,12));

           let sh3 = Mat4.translation(-33,9, -76);
           sh3 = sh3.times(Mat4.rotation(Math.PI/2, 1,0,0));
           sh3 = sh3.times(Mat4.scale(6,0.1,5));

           let sh4 = Mat4.translation(-17, 0.01, -62.5);
           sh4 = sh4.times(Mat4.rotation(Math.PI/6, 0,1,0));
           sh4 = sh4.times(Mat4.scale(3.5,0.1,5));

           let sh5 = Mat4.translation(-10.5, 0.01, -60.8);
           sh5 = sh5.times(Mat4.rotation(Math.PI/6, 0,1,0));
           sh5 = sh5.times(Mat4.scale(2,0.1,3));

           let sh6 = Mat4.translation(42.2, 0.01, -23);
           sh6 = sh6.times(Mat4.rotation(Math.PI/8, 0,1,0));
           sh6 = sh6.times(Mat4.scale(8,0.1,12));


           this.boxes_shadows = [sh1, sh2, sh3, sh4, sh5, sh6];
     }
    scatter() {
    //Create a class member variable to store cube's colors, scale factors, positions.
    //putting values in the array
    let posList = []; 
    let itemList = [];
    //pick out of 4 ranges
    var range; 
    var itemType; 
    var x, y, z; 
    var angle; 
    var x_diff;
    var z_diff;      
    
    //left of projectile
    const r0_xmin = -20; 
    const r0_xmax = -3; 
    const r0_zmin = -20; 
    const r0_zmax = 10; 

    //right of projectile
    const r1_xmin = 3; 
    const r1_xmax = 20; 
    const r1_zmin = -20; 
    const r1_zmax = 10; 

    //right of cash_register
    const r2_xmin = 20; 
    const r2_xmax = 40; 
    const r2_zmin = -70; 
    const r2_zmax = -50; 

    //left of cash_register, around boxes 
    const r3_xmin = -8; 
    const r3_xmax = 3; 
    const r3_zmin = -70; 
    const r3_zmax = -60; 

    //in between food and home/office: BACK 
    const r4_xmin = -9; 
    const r4_xmax = -5; 
    const r4_zmin = -50; 
    const r4_zmax = -40; 

    //in between home/office and trash: BACK 
    const r5_xmin = 5; 
    const r5_xmax = 9; 
    const r5_zmin = -50; 
    const r5_zmax = -40; 

    //in empty space next to boxes 
    const r6_xmin = -25; 
    const r6_xmax = -3; 
    const r6_zmin = -55; 
    const r6_zmax = -40; 


    var i = 0;
    for (i; i < 5; i++) {
        range = Math.floor(Math.random() * 15); //0 to 14
        itemType = Math.floor(Math.random() * 22 ); //0 to 23; //0 to 23
        if (itemType == 0) itemType += 1;
        if (itemType == 17) itemType += 1;
        if (itemType == 11) itemType += 1;
        if (itemType == 4) itemType += 1;
        if (itemType == 6) itemType += 1;
        if (itemType == 23) itemType += 1;



        angle = Math.random() * 2 * Math.PI; 

        switch(range) {
            case 0:
            case 7: 
            case 11: 
                x_diff = r0_xmax - r0_xmin; 
                z_diff = r0_zmax - r0_zmin; 
                x = (Math.floor(Math.random() * x_diff)) + r0_xmin;
                z = (Math.floor(Math.random() * z_diff)) + r0_zmin;
                break; 
            case 1:
            case 8: 
            case 12: 
                x_diff = r1_xmax - r1_xmin; 
                z_diff = r1_zmax - r1_zmin; 
                x = (Math.floor(Math.random() * x_diff)) + r1_xmin;
                z = (Math.floor(Math.random() * z_diff)) + r1_zmin;
                break;
            case 2:
                x_diff = r2_xmax - r2_xmin;
                z_diff = r2_zmax - r2_zmin; 
                x = (Math.floor(Math.random() * x_diff)) + r2_xmin;
                z = (Math.floor(Math.random() * z_diff)) + r2_zmin;
                break;
            case 3:
            case 9: 
            case 13: 
                x_diff = r3_xmax - r3_xmin; 
                z_diff = r3_zmax - r3_zmin; 
                x = (Math.floor(Math.random() * x_diff)) + r3_xmin;
                z = (Math.floor(Math.random() * z_diff)) + r3_zmin;
                break;
            case 4: 
                x_diff = r4_xmax - r4_xmin; 
                z_diff = r4_zmax - r4_zmin; 
                x = (Math.floor(Math.random() * x_diff)) + r4_xmin;
                z = (Math.floor(Math.random() * z_diff)) + r4_zmin;
                break; 
            case 5:
                x_diff = r5_xmax - r5_xmin; 
                z_diff = r5_zmax - r5_zmin; 
                x = (Math.floor(Math.random() * x_diff)) + r5_xmin;
                z = (Math.floor(Math.random() * z_diff)) + r5_zmin;
                break; 
            case 6: 
            case 10: 
            case 14: 
                x_diff = r6_xmax - r6_xmin; 
                z_diff = r6_zmax - r6_zmin; 
                x = (Math.floor(Math.random() * x_diff)) + r6_xmin;
                z = (Math.floor(Math.random() * z_diff)) + r6_zmin;
                break; 
            default: 
                x_diff = r2_xmax - r2_xmin;
                z_diff = r2_zmax - r2_zmin; 
                x = (Math.floor(Math.random() * x_diff)) + r2_xmin;
                z = (Math.floor(Math.random() * z_diff)) + r2_zmin;
                break;
        }

        switch(itemType) {
        case 0: //kleenex 2 
        case 11: //kleenex 1 
          y = 1.25;
          break; 
        case 1: //pocky
          y = 0.25;
          break;
        case 2: //orange
          y = 0.75; 
          break;
        case 3: //nat geo mag 1
        case 18: //nat geo mag 3
        case 22: //nat geo mag 2
          y = 0.1;
          break;
        case 4: //magic 8 ball 
        case 6: //crumpled paper 1
        case 23: //crumpled paper 2
          y = 1;
          break;
        case 5: //pineapple
          y = 3;
          break;
        case 7: //newspaper
          y = 0.15;
          break;
        case 8: //coca cola 
        case 9: //eaten apple
          y = 0.55;
          break;
        case 10: //bananas 
          y = 1.5;
          break;
        case 12: //chocolate
          y = 0.15;
          break;
        case 13: //starbucks 
          y = 0.85;
          break;
        case 14: //apple
          y = 1.2; 
          break;
        case 15: //calpico
          y = 0.8;
          break;
        case 16: //coconut water
          y = 0.75; 
          break;
        case 17: //baseball 
        case 19: //arizona 
          y = 0.5;
          break;
        case 20: //crayons
          y = 0.2; 
          break;
        case 21: //paper plane
          y = 0.35; 
          break;
        default:
          break;
      }
        posList.push([x,y,z, angle]);
        itemList.push(itemType);
    }
    
    this.itemPos = posList; 
    this.items = itemList; 
    
  }
  draw_scattered(context, program_state) {
    var i = 0; 
    let moveX; 
    let moveY; 
    let moveZ; 
    let angle;
    let translate;
    let rotate;  
    let transform; 
    let flipOver; 
    let itemType; 

    for ( i; i < this.items.length; i++ ) {
        moveX = this.itemPos[i][0]; 
        moveY = this.itemPos[i][1];
        moveZ = this.itemPos[i][2];
        angle = this.itemPos[i][3];

        translate = Mat4.translation(moveX, moveY, moveZ);
        rotate = Mat4.rotation(angle, 0, 1, 0); 
        flipOver = Mat4.rotation(Math.PI/2, 0, 0, 1);

        transform = translate.times(rotate); //.times(flipOver);
    
        itemType = this.items[i];

        switch(itemType) {
        case 0: //kleenex 2
            transform = transform.times(flipOver);
            this.shapes.kleenex_2.draw(context, program_state, transform, this.materials.kleenex_2);   
            break;         
        case 1: //pocky
            transform = transform.times(flipOver);
            this.shapes.pocky.draw(context, program_state, transform, this.materials.pocky);
            break;
        case 2: //orange
            transform = transform.times(Mat4.scale(0.7, 0.7, 0.7));
            this.shapes.orange.draw(context, program_state, transform, this.materials.orange);
            break;
        case 3: //nat geo mag 1
            transform = transform.times(Mat4.scale(2, 1, 2)); 
            this.shapes.nat_geo_mag_1.draw(context, program_state, transform, this.materials.nat_geo_mag_1); //.times(Mat4.translation(0, moveY, 0))
            break;
        case 4: //magic 8 ball
            this.shapes.ball.draw(context, program_state, transform, this.materials.magic8ball);
            break;
        case 5: //pineapple
            this.shapes.pineapple.draw(context, program_state, transform, this.materials.pineapple);
            break;
        case 6: //crumpled paper 1
            transform = transform.times(Mat4.scale(0.8, 0.8, 0.8));
            this.shapes.crumpled_paper_1.draw(context, program_state, transform, this.materials.crumpled_paper_1);
            break;
        case 7: //newspaper
            transform = transform.times(Mat4.scale(2, 1, 2));
            this.shapes.newspaper.draw(context, program_state, transform, this.materials.newspaper);
            break;
        case 8: //coca cola 
            transform = transform.times(flipOver);
            this.shapes.coke.draw(context, program_state, transform, this.materials.coke);
            break;
        case 9: //eaten apple
            transform = transform.times(flipOver).times(Mat4.scale(0.5,0.5,0.5));
            this.shapes.eaten_apple.draw(context, program_state, transform, this.materials.eaten_apple);
            break;
        case 10: //bananas
            this.shapes.bananas.draw(context, program_state, transform, this.materials.bananas);
            break;
        case 11: //kleenex 1 
            transform = transform.times(flipOver).times(Mat4.scale(0.8, 0.8, 0.8));
            this.shapes.kleenex_1.draw(context, program_state, transform, this.materials.kleenex_1);
            break;
        case 12: //chocolate
            transform = transform.times(Mat4.scale(1.25, 0.1, 0.75));
            this.shapes.cube.draw(context, program_state, transform, this.materials.chocolate);
            break;
        case 13: //starbucks 
            transform = transform.times(flipOver);
            this.shapes.starbucks.draw(context, program_state, transform, this.materials.starbucks);
            break;
        case 14: //apple
            transform = transform.times(Mat4.scale(0.7, 0.7, 0.7));
            this.shapes.apple.draw(context, program_state, transform, this.materials.apple);
            break;
        case 15: //calpico
            transform = transform.times(flipOver).times(Mat4.scale(1.5,1.5,1.5));
            this.shapes.calpico.draw(context, program_state, transform, this.materials.calpico);
            break;
        case 16: //coconut water 
            transform = transform.times(flipOver);
            this.shapes.coconut_water.draw(context, program_state, transform, this.materials.coconut_water);
            break;
        case 17: //baseball 
            transform = transform.times(Mat4.scale(0.5,0.5,0.5));
            this.shapes.ball.draw(context, program_state, transform, this.materials.baseball);
            break;
        case 18: //nat geo mag 3
            transform = transform.times(Mat4.scale(2, 1, 2)); 
            this.shapes.nat_geo_mag_3.draw(context, program_state, transform, this.materials.nat_geo_mag_3);
            break;
        case 19: //arizona
            transform = transform.times(flipOver);
            this.shapes.arizona.draw(context, program_state, transform, this.materials.arizona);
            break;
        case 20: //crayons 
            this.shapes.crayons.draw(context, program_state, transform, this.materials.crayons);
            break;
        case 21: //paper plane
            this.shapes.paper_plane.draw(context, program_state, transform, this.materials.paper_plane);
            break;
        case 22: //nat geo mag 2
            transform = transform.times(Mat4.scale(2, 1, 2)); 
            this.shapes.nat_geo_mag_2.draw(context, program_state, transform, this.materials.nat_geo_mag_2);
            break;
        case 23: //crunmpled paper 2
            transform = transform.times(Mat4.scale(0.8, 0.8, 0.8));
            this.shapes.crumpled_paper_2.draw(context, program_state, tr_ball, this.materials.crumpled_paper_2);
            break; 
        }
    }
  }

      //helper functions
  reset_bg()
  {
      this.curr_bg.loop = false;
      this.curr_bg.pause();
      this.curr_bg.currentTime = 0;
  }
  
  play_sound() 
  {
    if (!this.isplaying) 
    {

      this.curr_bg.currentTime = 0.05;
      this.curr_bg.play();
      this.isplaying = true;
    }
  }

  stop_sound() 
  {
    setTimeout(function() { this.curr_bg.pause(); this.curr_bg.currentTime = 0;}, 50);
    this.isplaying = false;
  }
/*
  play_sound(sound)
  {

    var playPromise = sound.play();


    if (playPromise !== undefined) 
    {
      playPromise.then(_ => {
      // Automatic playback started!
      // Show playing UI.
    })
    .catch(error => {
      // Auto-play was prevented
      // Show paused UI.
    });
    }
  }
*/
  reset_se()
  {

    this.curr_sound_effect.pause();
    this.curr_sound_effect.currentTime = 0;
  }

}
