using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;

namespace Tic_Tac_Toe
{
    public class JwtBearerConfigureOptions : IConfigureNamedOptions<JwtBearerOptions>
    {
        private const string CONFIGURATION_SECTION_NAME = "JwtBearer";

        private readonly IConfiguration _configuration;

        public JwtBearerConfigureOptions(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void Configure(string? name, JwtBearerOptions options)
        {
            Configure(options);
        }

        public void Configure(JwtBearerOptions options)
        {
            _configuration.GetSection(CONFIGURATION_SECTION_NAME).Bind(options);
        }
    }
}
