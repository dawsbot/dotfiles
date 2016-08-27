(function() {
  var ScriptOptions;

  ScriptOptions = require('../lib/script-options');

  describe('ScriptOptions', function() {
    beforeEach(function() {
      this.scriptOptions = new ScriptOptions();
      this.dummyEnv = {
        SCRIPT_CI: 'true',
        SCRIPT_ENV: 'test',
        _NUMBERS: '123'
      };
      return this.dummyEnvString = "SCRIPT_CI=true;SCRIPT_ENV='test';_NUMBERS=\"123\"";
    });
    describe('getEnv', function() {
      it('should default to an empty env object', function() {
        var env;
        env = this.scriptOptions.getEnv();
        return expect(env).toEqual({});
      });
      return it('should parse a custom user environment', function() {
        var env;
        this.scriptOptions.env = this.dummyEnvString;
        env = this.scriptOptions.getEnv();
        return expect(env).toEqual;
      });
    });
    return describe('mergedEnv', function() {
      it('should default to the orignal env object', function() {
        var mergedEnv;
        mergedEnv = this.scriptOptions.mergedEnv(this.dummyEnv);
        return expect(mergedEnv).toEqual(this.dummyEnv);
      });
      it('should retain the original environment', function() {
        var mergedEnv;
        this.scriptOptions.env = "TEST_VAR_1=one;TEST_VAR_2=\"two\";TEST_VAR_3='three'";
        mergedEnv = this.scriptOptions.mergedEnv(this.dummyEnv);
        expect(mergedEnv.SCRIPT_CI).toEqual('true');
        expect(mergedEnv.SCRIPT_ENV).toEqual('test');
        expect(mergedEnv._NUMBERS).toEqual('123');
        expect(mergedEnv.TEST_VAR_1).toEqual('one');
        expect(mergedEnv.TEST_VAR_2).toEqual('two');
        return expect(mergedEnv.TEST_VAR_3).toEqual('three');
      });
      return it('should support special character values', function() {
        var mergedEnv;
        this.scriptOptions.env = "TEST_VAR_1=o-n-e;TEST_VAR_2=\"nested\\\"doublequotes\\\"\";TEST_VAR_3='nested\\\'singlequotes\\\'';TEST_VAR_4='s p a c e s'";
        mergedEnv = this.scriptOptions.mergedEnv(this.dummyEnv);
        expect(mergedEnv.TEST_VAR_1).toEqual('o-n-e');
        expect(mergedEnv.TEST_VAR_2).toEqual("nested\\\"doublequotes\\\"");
        expect(mergedEnv.TEST_VAR_3).toEqual("nested\\\'singlequotes\\\'");
        return expect(mergedEnv.TEST_VAR_4).toEqual('s p a c e s');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9zcGVjL3NjcmlwdC1vcHRpb25zLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSx1QkFBUixDQUFoQixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxhQUFBLENBQUEsQ0FBckIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FDRTtBQUFBLFFBQUEsU0FBQSxFQUFXLE1BQVg7QUFBQSxRQUNBLFVBQUEsRUFBWSxNQURaO0FBQUEsUUFFQSxRQUFBLEVBQVUsS0FGVjtPQUZGLENBQUE7YUFLQSxJQUFDLENBQUEsY0FBRCxHQUFrQixvREFOVDtJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFRQSxRQUFBLENBQVMsUUFBVCxFQUFtQixTQUFBLEdBQUE7QUFDakIsTUFBQSxFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQSxHQUFBO0FBQzFDLFlBQUEsR0FBQTtBQUFBLFFBQUEsR0FBQSxHQUFNLElBQUMsQ0FBQSxhQUFhLENBQUMsTUFBZixDQUFBLENBQU4sQ0FBQTtlQUNBLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxPQUFaLENBQW9CLEVBQXBCLEVBRjBDO01BQUEsQ0FBNUMsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUEsR0FBQTtBQUMzQyxZQUFBLEdBQUE7QUFBQSxRQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixHQUFxQixJQUFDLENBQUEsY0FBdEIsQ0FBQTtB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/spec/script-options-spec.coffee
